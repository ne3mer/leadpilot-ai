-- Phase 3: add Won and Lost terminal statuses (preserve existing rows and RLS)

do $migration$
declare
  constraint_name text;
begin
  select con.conname
  into constraint_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = rel.relnamespace
  where nsp.nspname = 'public'
    and rel.relname = 'leads'
    and con.contype = 'c'
    and pg_get_constraintdef(con.oid) ilike '%status%'
  limit 1;

  if constraint_name is not null then
    execute format('alter table public.leads drop constraint %I', constraint_name);
  end if;
end
$migration$;

alter table public.leads
  add constraint leads_status_check
  check (
    status in (
      'New',
      'Contacted',
      'Qualified',
      'Proposal Sent',
      'Negotiation',
      'Won',
      'Lost'
    )
  );
