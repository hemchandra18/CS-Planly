import { differenceInCalendarDays } from 'date-fns';
import { supabase } from '@/lib/supabase';
import type { PlanTopic, ProgressStats, TopicStatus } from '@/lib/types';

export async function updateTopicStatus(userId: string, planTopicId: string, status: TopicStatus) {
  const { data: plan, error: planError } = await supabase.from('study_plans').select('id').eq('user_id', userId).eq('status', 'active').maybeSingle();
  if (planError) return { error: planError };
  if (!plan) return { error: new Error('No active plan found.') };
  const { data: days, error: daysError } = await supabase.from('plan_days').select('id').eq('plan_id', plan.id);
  if (daysError) return { error: daysError };
  const dayIds = (days ?? []).map((day) => day.id);
  if (!dayIds.length) return { error: new Error('This plan has no scheduled days yet.') };
  const { error } = await supabase.from('plan_topics').update({ status, completed_at: status === 'done' ? new Date().toISOString() : null }).eq('id', planTopicId).in('day_id', dayIds);
  return { error };
}

export async function loadProgressStats(userId: string): Promise<{ stats: ProgressStats | null; error: Error | null }> {
  const { data: plan, error: planError } = await supabase.from('study_plans').select('id, start_date, target_date').eq('user_id', userId).eq('status', 'active').maybeSingle();
  if (planError) return { stats: null, error: planError };
  if (!plan) return { stats: null, error: null };
  const { data: days, error: daysError } = await supabase.from('plan_days').select('id').eq('plan_id', plan.id);
  if (daysError) return { stats: null, error: daysError };
  const { data: topics, error: topicsError } = await supabase.from('plan_topics').select('status').in('day_id', (days ?? []).map((day) => day.id));
  if (topicsError) return { stats: null, error: topicsError };
  const totalTopics = topics?.length ?? 0; const completedTopics = topics?.filter((topic) => topic.status === 'done').length ?? 0; const skippedTopics = topics?.filter((topic) => topic.status === 'skipped').length ?? 0; const revisionTopics = topics?.filter((topic) => topic.status === 'revision').length ?? 0; const overallPercent = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0; const today = new Date(); const daysElapsed = Math.max(1, differenceInCalendarDays(today, new Date(`${plan.start_date}T00:00:00`)) + 1); const daysRemaining = plan.target_date ? Math.max(0, differenceInCalendarDays(new Date(`${plan.target_date}T00:00:00`), today)) : 0; const expectedPercent = totalTopics ? Math.min(100, Math.round((daysElapsed / Math.max(1, daysElapsed + daysRemaining)) * 100)) : 0; const pace = overallPercent >= expectedPercent + 10 ? 'ahead' : overallPercent + 10 < expectedPercent ? 'behind' : 'on-track';
  return { stats: { totalTopics, completedTopics, skippedTopics, revisionTopics, overallPercent, daysRemaining, daysElapsed, pace, paceMessage: pace === 'ahead' ? 'You are ahead of your target pace.' : pace === 'behind' ? 'A little more consistency will get you back on track.' : 'You are on track with your study plan.' }, error: null };
}

export async function loadAllPlanTopics(userId: string): Promise<{ topics: PlanTopic[]; error: Error | null }> {
  const { data: plan, error: planError } = await supabase.from('study_plans').select('id').eq('user_id', userId).eq('status', 'active').maybeSingle();
  if (planError) return { topics: [], error: planError }; if (!plan) return { topics: [], error: null };
  const { data: days, error: daysError } = await supabase.from('plan_days').select('id, day_number, calendar_date, day_type').eq('plan_id', plan.id).order('day_number');
  if (daysError) return { topics: [], error: daysError };
  const dayIds = (days ?? []).map((day) => day.id);
  if (!dayIds.length) return { topics: [], error: null };
  const { data: rows, error: rowsError } = await supabase.from('plan_topics').select('*').in('day_id', dayIds).order('display_order');
  if (rowsError) return { topics: [], error: rowsError };
  const topicIds = (rows ?? []).map((row) => row.topic_id);
  const { data: topicRows, error: topicError } = topicIds.length ? await supabase.from('topics').select('*').in('id', topicIds) : { data: [], error: null };
  if (topicError) return { topics: [], error: topicError };
  const topicMap = new Map((topicRows ?? []).map((topic) => [topic.id, topic]));
  return { topics: (rows ?? []).map((row) => { const topic = topicMap.get(row.topic_id); return { id: row.id, dayId: row.day_id, topicId: row.topic_id, displayOrder: row.display_order, status: row.status, completedAt: row.completed_at ?? undefined, userNotes: row.user_notes ?? undefined, topic: topic ? { id: topic.id, sectionId: topic.section_id, title: topic.title, difficulty: topic.difficulty, estimatedMinutes: topic.estimated_minutes, concept: { explanation: topic.concept_explanation, examples: topic.concept_examples ?? [], codeSnippets: topic.code_snippets ?? {} }, resources: topic.resources ?? [], problems: [], prerequisites: topic.prerequisites ?? [], displayOrder: topic.display_order } : undefined }; }) as PlanTopic[], error: null };
}

export async function loadTopic(topicId: string) {
  const { data: topic, error } = await supabase.from('topics').select('*').eq('id', topicId).maybeSingle();
  if (error || !topic) return { topic: null, problems: [], error: error ?? new Error('Topic not found.') };
  const { data: problems, error: problemsError } = await supabase.from('problems').select('*').eq('topic_id', topicId).order('display_order');
  if (problemsError) return { topic: null, problems: [], error: problemsError };
  return { topic: { id: topic.id, sectionId: topic.section_id, title: topic.title, difficulty: topic.difficulty, estimatedMinutes: topic.estimated_minutes, concept: { explanation: topic.concept_explanation, examples: topic.concept_examples ?? [], codeSnippets: topic.code_snippets ?? {} }, resources: topic.resources ?? [], problems: (problems ?? []).map((problem) => ({ id: problem.id, title: problem.title, difficulty: problem.difficulty, platform: problem.platform, externalUrl: problem.external_url, problemNumber: problem.problem_number ?? undefined, displayOrder: problem.display_order })), prerequisites: topic.prerequisites ?? [], displayOrder: topic.display_order }, problems: [], error: null };
}

export async function archiveActivePlan(userId: string) {
  const { error } = await supabase.from('study_plans').update({ status: 'archived' }).eq('user_id', userId).eq('status', 'active');
  return { error };
}
