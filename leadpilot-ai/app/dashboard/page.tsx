import { redirect } from "next/navigation";
import { DashboardShell } from "@/app/dashboard/dashboard-shell";
import { listLeadsForCurrentUser } from "@/lib/leads/repository";
import type { Lead } from "@/lib/lead-types";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let initialLeads: Lead[] = [];
  let leadsError: string | null = null;

  try {
    initialLeads = await listLeadsForCurrentUser(supabase);
  } catch (error) {
    leadsError = error instanceof Error ? error.message : "Unable to load leads.";
  }

  return (
    <DashboardShell
      initialLeads={initialLeads}
      userLabel={user.email ?? "Signed in"}
      leadsError={leadsError}
    />
  );
}
