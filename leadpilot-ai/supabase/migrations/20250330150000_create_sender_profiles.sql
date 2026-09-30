-- LeadPilot AI: per-user sender profiles with RLS

create table if not exists public.sender_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  full_name text not null check (
    char_length(trim(full_name)) >= 1
    and char_length(full_name) <= 100
  ),
  job_title text check (
    job_title is null
    or char_length(trim(job_title)) <= 100
  ),
  company_name text not null check (
    char_length(trim(company_name)) >= 1
    and char_length(company_name) <= 150
  ),
  company_description text check (
    company_description is null
    or char_length(company_description) <= 1000
  ),
  services text check (
    services is null
    or char_length(services) <= 1000
  ),
  target_customers text check (
    target_customers is null
    or char_length(target_customers) <= 500
  ),
  value_proposition text check (
    value_proposition is null
    or char_length(value_proposition) <= 1000
  ),
  tone_preference text not null default 'professional' check (
    tone_preference in ('professional', 'friendly', 'concise')
  ),
  website text check (
    website is null
    or char_length(website) <= 300
  ),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists sender_profiles_set_updated_at on public.sender_profiles;
create trigger sender_profiles_set_updated_at
before update on public.sender_profiles
for each row
execute function public.set_updated_at();

alter table public.sender_profiles enable row level security;

drop policy if exists "Users can select own sender profile" on public.sender_profiles;
create policy "Users can select own sender profile"
on public.sender_profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own sender profile" on public.sender_profiles;
create policy "Users can insert own sender profile"
on public.sender_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own sender profile" on public.sender_profiles;
create policy "Users can update own sender profile"
on public.sender_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own sender profile" on public.sender_profiles;
create policy "Users can delete own sender profile"
on public.sender_profiles
for delete
to authenticated
using (auth.uid() = user_id);
