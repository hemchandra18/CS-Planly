import { supabase } from '@/lib/supabase';
import type { Section, Subject, TopicData } from '@/lib/types';

export const FALLBACK_SUBJECTS: Subject[] = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    icon: 'binary',
    color: '#7c8db5',
    category: 'dsa',
    displayOrder: 1,
    sections: [
      {
        id: 'dsa-foundations',
        subjectId: 'dsa',
        name: 'Foundations',
        description: 'The building blocks for solving problems.',
        displayOrder: 1,
        topics: [
          {
            id: 'complexity-analysis',
            sectionId: 'dsa-foundations',
            title: 'Complexity Analysis',
            difficulty: 'easy',
            estimatedMinutes: 35,
            concept: {
              explanation: 'Learn to describe how an algorithm scales with input size using time and space complexity.',
              examples: ['Compare a single loop with a nested loop.', 'Identify the dominant term in a sum.'],
              codeSnippets: {},
            },
            resources: [],
            prerequisites: [],
            displayOrder: 1,
            problems: [
              {
                id: 'complexity-loop-count',
                title: 'Count Operations in a Loop',
                difficulty: 'easy',
                platform: 'gfg',
                externalUrl: 'https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/',
                displayOrder: 1,
              },
            ],
          },
        ],
      },
      {
        id: 'dsa-arrays',
        subjectId: 'dsa',
        name: 'Arrays & Strings',
        description: 'Patterns that appear in interviews and contests.',
        displayOrder: 2,
        topics: [
          {
            id: 'arrays-basics',
            sectionId: 'dsa-arrays',
            title: 'Arrays Basics',
            difficulty: 'easy',
            estimatedMinutes: 45,
            concept: {
              explanation: 'Understand contiguous storage, indexing, traversal, and common array operations.',
              examples: ['Find the maximum element.', 'Reverse an array in place.'],
              codeSnippets: {},
            },
            resources: [],
            prerequisites: [],
            displayOrder: 1,
            problems: [
              {
                id: 'arrays-max-element',
                title: 'Largest Element in Array',
                difficulty: 'easy',
                platform: 'gfg',
                externalUrl: 'https://practice.geeksforgeeks.org/problems/largest-element-in-array4009/1',
                displayOrder: 1,
              },
            ],
          },
          {
            id: 'two-pointers',
            sectionId: 'dsa-arrays',
            title: 'Two Pointers',
            difficulty: 'medium',
            estimatedMinutes: 60,
            concept: {
              explanation: 'Use two moving indexes to solve ordered-array and string problems in linear time.',
              examples: ['Pair sum in a sorted array.', 'Remove duplicates in place.'],
              codeSnippets: {},
            },
            resources: [],
            prerequisites: [],
            displayOrder: 2,
            problems: [
              {
                id: 'two-sum-ii',
                title: 'Two Sum II - Input Array Is Sorted',
                difficulty: 'medium',
                platform: 'leetcode',
                externalUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
                problemNumber: '167',
                displayOrder: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'core-cs',
    name: 'Core Computer Science',
    icon: 'cpu',
    color: '#8d9b76',
    category: 'core-cs',
    displayOrder: 2,
    sections: [
      {
        id: 'os-foundations',
        subjectId: 'core-cs',
        name: 'Operating Systems',
        description: 'Processes, memory, and concurrency fundamentals.',
        displayOrder: 1,
        topics: [
          {
            id: 'processes-threads',
            sectionId: 'os-foundations',
            title: 'Processes & Threads',
            difficulty: 'medium',
            estimatedMinutes: 50,
            concept: {
              explanation: 'Understand the difference between processes and threads and how the operating system schedules them.',
              examples: ['Compare isolated memory with shared memory.'],
              codeSnippets: {},
            },
            resources: [],
            prerequisites: [],
            displayOrder: 1,
            problems: [
              {
                id: 'process-vs-thread',
                title: 'Process vs Thread',
                difficulty: 'easy',
                platform: 'gfg',
                externalUrl: 'https://www.geeksforgeeks.org/difference-between-process-and-thread/',
                displayOrder: 1,
              },
            ],
          },
        ],
      },
    ],
  },
];

export async function loadCurriculum(): Promise<{ subjects: Subject[]; error: Error | null }> {
  try {
    const [subjectsResult, sectionsResult, topicsResult, problemsResult] = await Promise.all([
      supabase.from('subjects').select('*').order('display_order'),
      supabase.from('sections').select('*').order('display_order'),
      supabase.from('topics').select('*').order('display_order'),
      supabase.from('problems').select('*').order('display_order'),
    ]);
    const firstError = subjectsResult.error ?? sectionsResult.error ?? topicsResult.error ?? problemsResult.error;
    if (firstError || !subjectsResult.data?.length) {
      return { subjects: FALLBACK_SUBJECTS, error: null };
    }

    const problemsByTopic = new Map<string, TopicData['problems']>();
    for (const row of problemsResult.data ?? []) {
      const problems = problemsByTopic.get(row.topic_id) ?? [];
      problems.push({ id: row.id, title: row.title, difficulty: row.difficulty, platform: row.platform, externalUrl: row.external_url, problemNumber: row.problem_number ?? undefined, displayOrder: row.display_order });
      problemsByTopic.set(row.topic_id, problems);
    }

    const topicsBySection = new Map<string, TopicData[]>();
    for (const row of topicsResult.data ?? []) {
      const topics = topicsBySection.get(row.section_id) ?? [];
      topics.push({ id: row.id, sectionId: row.section_id, title: row.title, difficulty: row.difficulty, estimatedMinutes: row.estimated_minutes, concept: { explanation: row.concept_explanation, examples: row.concept_examples ?? [], codeSnippets: row.code_snippets ?? {} }, resources: row.resources ?? [], problems: problemsByTopic.get(row.id) ?? [], prerequisites: row.prerequisites ?? [], displayOrder: row.display_order });
      topicsBySection.set(row.section_id, topics);
    }

    const sectionsBySubject = new Map<string, Section[]>();
    for (const row of sectionsResult.data ?? []) {
      const sections = sectionsBySubject.get(row.subject_id) ?? [];
      sections.push({ id: row.id, subjectId: row.subject_id, name: row.name, description: row.description ?? undefined, displayOrder: row.display_order, topics: topicsBySection.get(row.id) ?? [] });
      sectionsBySubject.set(row.subject_id, sections);
    }

    return { subjects: (subjectsResult.data ?? []).map((row) => ({ id: row.id, name: row.name, icon: row.icon, color: row.color, category: row.category, displayOrder: row.display_order, sections: sectionsBySubject.get(row.id) ?? [] })), error: null };
  } catch {
    return { subjects: FALLBACK_SUBJECTS, error: null };
  }
}
