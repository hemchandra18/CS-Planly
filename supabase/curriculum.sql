create table if not exists public.subjects (
  id text primary key, name text not null, icon text not null default 'book-open',
  color text not null default '#7c8db5', category text not null, display_order integer not null default 0
);
create table if not exists public.sections (
  id text primary key, subject_id text not null references public.subjects(id) on delete cascade,
  name text not null, description text, display_order integer not null default 0
);
create table if not exists public.topics (
  id text primary key, section_id text not null references public.sections(id) on delete cascade,
  title text not null, difficulty text not null, estimated_minutes integer not null default 30,
  concept_explanation text not null default '', concept_examples text[] not null default '{}',
  code_snippets jsonb not null default '{}'::jsonb, resources jsonb not null default '[]'::jsonb,
  prerequisites text[] not null default '{}', display_order integer not null default 0
);
create table if not exists public.problems (
  id text primary key, topic_id text not null references public.topics(id) on delete cascade,
  title text not null, difficulty text not null, platform text not null, external_url text not null,
  problem_number text, display_order integer not null default 0
);

alter table public.subjects enable row level security;
alter table public.sections enable row level security;
alter table public.topics enable row level security;
alter table public.problems enable row level security;
create policy "Anyone can read subjects" on public.subjects for select using (true);
create policy "Anyone can read sections" on public.sections for select using (true);
create policy "Anyone can read topics" on public.topics for select using (true);
create policy "Anyone can read problems" on public.problems for select using (true);
grant usage on schema public to anon, authenticated;
grant select on public.subjects, public.sections, public.topics, public.problems to anon, authenticated;

insert into public.subjects (id, name, icon, color, category, display_order) values
  ('dsa', 'Data Structures & Algorithms', 'binary', '#7c8db5', 'dsa', 1),
  ('core-cs', 'Core Computer Science', 'cpu', '#8d9b76', 'core-cs', 2)
on conflict (id) do nothing;
insert into public.sections (id, subject_id, name, description, display_order) values
  ('dsa-foundations', 'dsa', 'Foundations', 'The building blocks for solving problems.', 1),
  ('dsa-arrays', 'dsa', 'Arrays & Strings', 'Patterns that appear in interviews and contests.', 2),
  ('os-foundations', 'core-cs', 'Operating Systems', 'Processes, memory, and concurrency fundamentals.', 1)
on conflict (id) do nothing;
insert into public.topics (id, section_id, title, difficulty, estimated_minutes, concept_explanation, concept_examples, display_order) values
  ('complexity-analysis', 'dsa-foundations', 'Complexity Analysis', 'easy', 35, 'Learn to describe how an algorithm scales with input size using time and space complexity.', array['Compare a single loop with a nested loop.', 'Identify the dominant term in a sum.'], 1),
  ('arrays-basics', 'dsa-arrays', 'Arrays Basics', 'easy', 45, 'Understand contiguous storage, indexing, traversal, and common array operations.', array['Find the maximum element.', 'Reverse an array in place.'], 1),
  ('two-pointers', 'dsa-arrays', 'Two Pointers', 'medium', 60, 'Use two moving indexes to solve ordered-array and string problems in linear time.', array['Pair sum in a sorted array.', 'Remove duplicates in place.'], 2),
  ('processes-threads', 'os-foundations', 'Processes & Threads', 'medium', 50, 'Understand the difference between processes and threads and how the operating system schedules them.', array['Compare isolated memory with shared memory.'], 1)
on conflict (id) do nothing;
insert into public.problems (id, topic_id, title, difficulty, platform, external_url, problem_number, display_order) values
  ('complexity-loop-count', 'complexity-analysis', 'Count Operations in a Loop', 'easy', 'gfg', 'https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/', null, 1),
  ('arrays-max-element', 'arrays-basics', 'Largest Element in Array', 'easy', 'gfg', 'https://practice.geeksforgeeks.org/problems/largest-element-in-array4009/1', null, 1),
  ('two-sum-ii', 'two-pointers', 'Two Sum II - Input Array Is Sorted', 'medium', 'leetcode', 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', '167', 1),
  ('process-vs-thread', 'processes-threads', 'Process vs Thread', 'easy', 'gfg', 'https://www.geeksforgeeks.org/difference-between-process-and-thread/', null, 1)
on conflict (id) do nothing;
