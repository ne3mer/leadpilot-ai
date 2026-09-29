import { redirect } from "next/navigation";
import { DashboardShell } from "@/app/dashboard/dashboard-shell";
import {
  computeLeadPerformanceTrend,
  type LeadPerformanceTrendPoint,
} from "@/lib/leads/chart-data";
import { computeLeadMetrics, type LeadDashboardMetrics } from "@/lib/leads/metrics";
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
  let metrics: LeadDashboardMetrics | null = null;
  let metricsError: string | null = null;
  let performanceTrend: LeadPerformanceTrendPoint[] | null = null;
  let chartError: string | null = null;

  try {
    initialLeads = await listLeadsForCurrentUser(supabase);
    metrics = computeLeadMetrics(initialLeads);
    performanceTrend = computeLeadPerformanceTrend(initialLeads);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load leads.";
    leadsError = message;
    metricsError = message;
    chartError = message;
  }

  return (
    <DashboardShell
      initialLeads={initialLeads}
      metrics={metrics}
      metricsError={metricsError}
      performanceTrend={performanceTrend}
      chartError={chartError}
      userLabel={user.email ?? "Signed in"}
      leadsError={leadsError}
    />
  );
}
