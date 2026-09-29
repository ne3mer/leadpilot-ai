# LeadPilot AI

Next.js SaaS MVP for lead management with Supabase authentication and PostgreSQL-backed lead CRUD.

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project

## Setup

### 1. Create a Supabase project

Create a new project in the Supabase dashboard.

### 2. Configure environment variables

Copy the example env file and fill in your project values:

```bash
cp .env.example .env.local
```

Set:

- `NEXT_PUBLIC_SUPABASE_URL` — Project URL (Settings → API)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project **anon/public** key (Settings → API)

Do **not** put the service role key in `.env.local` for this app. Normal CRUD uses the anon key with Row Level Security.

### 3. Run the database migration

Apply the version-controlled schema in `supabase/migrations/20250330000000_create_leads.sql` using one of:

**Option A — Supabase SQL Editor**

1. Open SQL Editor in the Supabase dashboard.
2. Paste the migration file contents.
3. Run the script.

**Option B — Supabase CLI**

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

This creates the `leads` table, indexes, `updated_at` trigger, and RLS policies.

### 4. Configure Auth (recommended)

In Supabase → Authentication → Providers → Email:

- Enable Email provider.
- For local development, you may disable “Confirm email” to sign in immediately after sign-up.
- For production, keep email confirmation enabled.

Add your local site URL under Authentication → URL Configuration (e.g. `http://localhost:3000`).

### 5. Start the development server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Test authentication

1. Visit `/login`.
2. Create an account (Sign up) or sign in.
3. Confirm you are redirected to `/dashboard`.
4. Use **Sign out** in the header and confirm `/dashboard` redirects to `/login`.

### 7. Test lead CRUD

1. Sign in and open `/dashboard`.
2. Add a lead with the form.
3. Change status, delete a lead, refresh the page — data should persist.
4. Sign in as a second user in another browser/profile — each user should only see their own leads (RLS).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Architecture (Phase 1)

- **Auth:** Supabase Auth with `@supabase/ssr` cookie sessions; `middleware.ts` protects `/dashboard`.
- **Database:** PostgreSQL `leads` table with RLS (`auth.uid() = user_id`).
- **Data access:** `lib/leads/repository.ts` (queries) and `lib/leads/actions.ts` (Server Actions).
- **Clients:** `lib/supabase/server.ts` (Server Components/Actions), `lib/supabase/client.ts` (browser, if needed later).

## Legacy localStorage leads

If this browser previously stored demo leads under `leadpilot.dashboard.leads`, the dashboard performs a **one-time import** only when the signed-in user has **zero** leads in the database. Database data is never overwritten by localStorage.
