-- Run this once in Supabase SQL Editor for existing Planly databases.
alter table public.profiles add column if not exists target_role text;
alter table public.profiles add column if not exists experience_level text;
alter table public.profiles add column if not exists company_type text;
alter table public.profiles add column if not exists company_region text;
grant usage on schema public to authenticated;
grant select, insert, update on public.profiles to authenticated;
