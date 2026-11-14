import { addDays, differenceInCalendarDays, format, startOfDay } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { loadCurriculum } from '@/lib/curriculum';
import type { OnboardingAnswers, PlanTopic, TopicData } from '@/lib/types';

const difficultyWeight = { easy: 1, medium: 2, hard: 3 } as const;

function flattenTopics(subjectIds: string[], subjects: Awaited<ReturnType<typeof loadCurriculum>>['subjects']) {
  return subjects.filter((subject) => subjectIds.includes(subject.id)).flatMap((subject) => subject.sections ?? []).flatMap((section) => section.topics ?? []);
}

function sortTopics(topics: TopicData[], level: OnboardingAnswers['skillLevel']) {
  const preferred = level === 'beginner' ? 1 : level === 'advanced' ? 3 : 2;
  return [...topics].sort((a, b) => {
    const difficultyDelta = Math.abs(difficultyWeight[a.difficulty] - preferred) - Math.abs(difficultyWeight[b.difficulty] - preferred);
    return difficultyDelta || a.displayOrder - b.displayOrder;
  });
}

export async function generateAndPersistPlan(userId: string, answers: OnboardingAnswers) {
  const { subjects, error: curriculumError } = await loadCurriculum();
  if (curriculumError) return { error: curriculumError };
  const selectedTopics = sortTopics(flattenTopics(answers.selectedSubjects, subjects), answers.skillLevel);
  if (!selectedTopics.length) return { error: new Error('No curriculum topics match your selected subjects. Run curriculum.sql in Supabase first.') };

  const startDate = startOfDay(new Date());
  const targetDate = answers.targetDate ? startOfDay(new Date(`${answers.targetDate}T00:00:00`)) : addDays(startDate, 90);
  const totalDays = Math.max(1, differenceInCalendarDays(targetDate, startDate) + 1);
  const activePlan = await supabase.from('study_plans').select('id').eq('user_id', userId).eq('status', 'active').maybeSingle();
  if (activePlan.error) return { error: activePlan.error };
  if (activePlan.data) return { planId: activePlan.data.id, error: null };

  const { data: plan, error: planError } = await supabase.from('study_plans').insert({ user_id: userId, status: 'active', total_topics: selectedTopics.length, total_days: totalDays, start_date: format(startDate, 'yyyy-MM-dd'), target_date: format(targetDate, 'yyyy-MM-dd'), plan_config: answers }).select('id').single();
  if (planError || !plan) return { error: planError ?? new Error('Unable to create study plan.') };

  const minutesPerDay = Math.max(30, answers.dailyHours * 60);
  const dayRows: Array<{ id: string; plan_id: string; day_number: number; calendar_date: string; day_type: 'study' | 'rest' | 'revision' }> = [];
  const topicRows: Array<{ day_id: string; topic_id: string; display_order: number; status: 'pending' }> = [];
  let topicIndex = 0;
  for (let dayIndex = 0; dayIndex < totalDays && topicIndex < selectedTopics.length; dayIndex += 1) {
    const date = addDays(startDate, dayIndex);
    const isWeekendBreak = answers.weekendBreaks && [0, 6].includes(date.getDay());
    const isRevision = answers.revisionDays && dayIndex > 0 && dayIndex % 7 === 6;
    const dayType = isWeekendBreak ? 'rest' : isRevision ? 'revision' : 'study';
    const dayId = crypto.randomUUID();
    dayRows.push({ id: dayId, plan_id: plan.id, day_number: dayIndex + 1, calendar_date: format(date, 'yyyy-MM-dd'), day_type: dayType });
    if (dayType !== 'rest') {
      let usedMinutes = 0; let order = 0;
      while (topicIndex < selectedTopics.length && usedMinutes + selectedTopics[topicIndex].estimatedMinutes <= minutesPerDay) {
        topicRows.push({ day_id: dayId, topic_id: selectedTopics[topicIndex].id, display_order: order, status: 'pending' });
        usedMinutes += selectedTopics[topicIndex].estimatedMinutes; topicIndex += 1; order += 1;
      }
      if (order === 0 && topicIndex < selectedTopics.length) { topicRows.push({ day_id: dayId, topic_id: selectedTopics[topicIndex].id, display_order: 0, status: 'pending' }); topicIndex += 1; }
    }
  }
  const { error: daysError } = await supabase.from('plan_days').insert(dayRows);
  if (daysError) return { error: daysError };
  const { error: topicsError } = topicRows.length ? await supabase.from('plan_topics').insert(topicRows) : { error: null };
  if (topicsError) return { error: topicsError };
  return { planId: plan.id, error: null };
}

export async function createSamplePlan(userId: string) {
  const { subjects, error: curriculumError } = await loadCurriculum();
  if (curriculumError) return { error: curriculumError };
  const sampleTopics = subjects.flatMap((subject) => subject.sections ?? []).flatMap((section) => section.topics ?? []).slice(0, 3);
  if (!sampleTopics.length) return { error: new Error('No curriculum topics found. Run curriculum.sql in Supabase first.') };

  await supabase.from('study_plans').update({ status: 'archived' }).eq('user_id', userId).eq('status', 'active');
  const startDate = startOfDay(new Date());
  const targetDate = addDays(startDate, 30);
  const { data: plan, error: planError } = await supabase.from('study_plans').insert({ user_id: userId, status: 'active', total_topics: sampleTopics.length, total_days: 3, start_date: format(startDate, 'yyyy-MM-dd'), target_date: format(targetDate, 'yyyy-MM-dd'), plan_config: { sample: true } }).select('id').single();
  if (planError || !plan) return { error: planError ?? new Error('Unable to create sample plan.') };

  const dayRows = [0, 1, 2].map((offset) => ({ id: crypto.randomUUID(), plan_id: plan.id, day_number: offset + 1, calendar_date: format(addDays(startDate, offset), 'yyyy-MM-dd'), day_type: 'study' as const }));
  const { error: daysError } = await supabase.from('plan_days').insert(dayRows);
  if (daysError) return { error: daysError };
  const topicRows = sampleTopics.map((topic, index) => ({ day_id: dayRows[0].id, topic_id: topic.id, display_order: index, status: 'pending' as const }));
  const { error: topicsError } = await supabase.from('plan_topics').insert(topicRows);
  return { error: topicsError };
}

export async function loadTodaysPlan(userId: string): Promise<{ topics: PlanTopic[]; error: Error | null }> {
  const today = format(new Date(), 'yyyy-MM-dd');
  const { data: plan, error: planError } = await supabase.from('study_plans').select('id').eq('user_id', userId).eq('status', 'active').maybeSingle();
  if (planError) return { topics: [], error: planError };
  if (!plan) return { topics: [], error: null };
  const { data: day, error: dayError } = await supabase.from('plan_days').select('id').eq('plan_id', plan.id).eq('calendar_date', today).maybeSingle();
  if (dayError) return { topics: [], error: dayError };
  if (!day) return { topics: [], error: null };
  const { data: rows, error: rowsError } = await supabase.from('plan_topics').select('*').eq('day_id', day.id).order('display_order');
  if (rowsError) return { topics: [], error: rowsError };
  const topicIds = (rows ?? []).map((row) => row.topic_id);
  const { data: topicRows, error: topicError } = topicIds.length ? await supabase.from('topics').select('*').in('id', topicIds) : { data: [], error: null };
  if (topicError) return { topics: [], error: topicError };
  const topicMap = new Map((topicRows ?? []).map((topic) => [topic.id, topic]));
  return { topics: (rows ?? []).map((row) => { const topic = topicMap.get(row.topic_id); return { id: row.id, dayId: row.day_id, topicId: row.topic_id, displayOrder: row.display_order, status: row.status, completedAt: row.completed_at ?? undefined, userNotes: row.user_notes ?? undefined, topic: topic ? { id: topic.id, sectionId: topic.section_id, title: topic.title, difficulty: topic.difficulty, estimatedMinutes: topic.estimated_minutes, concept: { explanation: topic.concept_explanation, examples: topic.concept_examples ?? [], codeSnippets: topic.code_snippets ?? {} }, resources: topic.resources ?? [], problems: [], prerequisites: topic.prerequisites ?? [], displayOrder: topic.display_order } : undefined }; }) as PlanTopic[], error: null };
}
