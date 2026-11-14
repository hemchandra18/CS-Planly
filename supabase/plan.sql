create table if not exists public.study_plans (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active', total_topics integer not null default 0, total_days integer not null default 0,
  start_date date not null, target_date date, generated_at timestamptz not null default now(), plan_config jsonb not null default '{}'::jsonb
);
create unique index if not exists one_active_plan_per_user on public.study_plans(user_id) where status = 'active';
create table if not exists public.plan_days (
  id uuid primary key, plan_id uuid not null references public.study_plans(id) on delete cascade,
  day_number integer not null, calendar_date date not null, day_type text not null
);
create table if not exists public.plan_topics (
  id uuid primary key default gen_random_uuid(), day_id uuid not null references public.plan_days(id) on delete cascade,
  topic_id text not null references public.topics(id) on delete cascade, display_order integer not null default 0,
  status text not null default 'pending', completed_at timestamptz, user_notes text
);
alter table public.study_plans enable row level security;
alter table public.plan_days enable row level security;
alter table public.plan_topics enable row level security;
create policy "Users can read their plans" on public.study_plans for select using (auth.uid() = user_id);
create policy "Users can create their plans" on public.study_plans for insert with check (auth.uid() = user_id);
create policy "Users can update their plans" on public.study_plans for update using (auth.uid() = user_id);
create policy "Users can read their plan days" on public.plan_days for select using (exists (select 1 from public.study_plans p where p.id = plan_id and p.user_id = auth.uid()));
create policy "Users can create their plan days" on public.plan_days for insert with check (exists (select 1 from public.study_plans p where p.id = plan_id and p.user_id = auth.uid()));
create policy "Users can read their plan topics" on public.plan_topics for select using (exists (select 1 from public.plan_days d join public.study_plans p on p.id = d.plan_id where d.id = day_id and p.user_id = auth.uid()));
create policy "Users can create their plan topics" on public.plan_topics for insert with check (exists (select 1 from public.plan_days d join public.study_plans p on p.id = d.plan_id where d.id = day_id and p.user_id = auth.uid()));
create policy "Users can update their plan topics" on public.plan_topics for update using (exists (select 1 from public.plan_days d join public.study_plans p on p.id = d.plan_id where d.id = day_id and p.user_id = auth.uid()));

grant usage on schema public to authenticated;
grant select, insert, update on public.study_plans to authenticated;
grant select, insert on public.plan_days to authenticated;
grant select, insert, update on public.plan_topics to authenticated;
