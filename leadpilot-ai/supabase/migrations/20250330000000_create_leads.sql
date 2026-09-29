-- LeadPilot AI: leads table with RLS

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  company text not null check (char_length(trim(company)) > 0),
  email text not null check (position('@' in email) > 1),
  status text not null check (
    status in (
      'New',
      'Contacted',
      'Qualified',
      'Proposal Sent',
      'Negotiation'
    )
  ),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists leads_user_id_idx on public.leads (user_id);
create index if not exists leads_user_id_created_at_idx on public.leads (user_id, created_at desc);
create unique index if not exists leads_user_email_unique_idx on public.leads (user_id, lower(email));

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

alter table public.leads enable row level security;

drop policy if exists "Users can select own leads" on public.leads;
create policy "Users can select own leads"
on public.leads
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own leads" on public.leads;
create policy "Users can insert own leads"
on public.leads
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own leads" on public.leads;
create policy "Users can update own leads"
on public.leads
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own leads" on public.leads;
create policy "Users can delete own leads"
on public.leads
for delete
to authenticated
using (auth.uid() = user_id);
