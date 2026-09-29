-- Manual RLS verification (run in Supabase SQL editor after creating two test users)
-- Replace UUIDs with auth.users ids from Authentication → Users.

-- As service role (SQL editor), insert two users' leads only via authenticated JWT in app.
-- Below documents expected behavior; run app-level tests A–K from README.

-- 1) Authenticated user can CRUD own rows (via app with anon key + session cookie).
-- 2) User A cannot SELECT/UPDATE/DELETE user B rows when using user A's JWT.
-- 3) INSERT with mismatched user_id is rejected by RLS (with check auth.uid() = user_id).

-- Example policy sanity check (should return policies):
select schemaname, tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where tablename = 'leads';
