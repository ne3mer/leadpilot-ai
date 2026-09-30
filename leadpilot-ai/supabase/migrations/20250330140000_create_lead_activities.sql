-- LeadPilot AI: lead activities (notes, emails, calls) with RLS

create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('note', 'email', 'call')),
  content text not null check (
    char_length(trim(content)) > 0
    and char_length(content) <= 5000
  ),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists lead_activities_lead_id_idx on public.lead_activities (lead_id);
create index if not exists lead_activities_user_id_idx on public.lead_activities (user_id);
create index if not exists lead_activities_created_at_idx on public.lead_activities (created_at);
create index if not exists lead_activities_lead_id_created_at_idx
  on public.lead_activities (lead_id, created_at desc);

alter table public.lead_activities enable row level security;

drop policy if exists "Users can select own lead activities" on public.lead_activities;
create policy "Users can select own lead activities"
on public.lead_activities
for select
to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.leads
    where leads.id = lead_activities.lead_id
      and leads.user_id = auth.uid()
  )
);

drop policy if exists "Users can insert own lead activities" on public.lead_activities;
create policy "Users can insert own lead activities"
on public.lead_activities
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.leads
    where leads.id = lead_id
      and leads.user_id = auth.uid()
  )
);

drop policy if exists "Users can update own lead activities" on public.lead_activities;
create policy "Users can update own lead activities"
on public.lead_activities
for update
to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.leads
    where leads.id = lead_activities.lead_id
      and leads.user_id = auth.uid()
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.leads
    where leads.id = lead_id
      and leads.user_id = auth.uid()
  )
);

drop policy if exists "Users can delete own lead activities" on public.lead_activities;
create policy "Users can delete own lead activities"
on public.lead_activities
for delete
to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.leads
    where leads.id = lead_activities.lead_id
      and leads.user_id = auth.uid()
  )
);
