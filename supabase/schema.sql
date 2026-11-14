create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '', avatar_url text,
  target_role text, experience_level text, company_type text, company_region text,
  goal text, selected_subjects text[] not null default '{}', skill_level text,
  daily_hours integer not null default 2, target_date date, preferred_language text,
  include_videos boolean not null default true, include_problems boolean not null default true,
  weekend_breaks boolean not null default false, revision_days boolean not null default true,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "Users can read their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

grant usage on schema public to authenticated;
grant select, insert, update on public.profiles to authenticated;
