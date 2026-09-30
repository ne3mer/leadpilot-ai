"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/ui/container";
import { DashboardAiMessagePanel } from "@/components/sections/dashboard/ai-message-panel";
import { DashboardHeroSection } from "@/components/sections/dashboard/dashboard-hero";
import { DashboardLeadsTable } from "@/components/sections/dashboard/leads-table";
import { DashboardPerformanceChart } from "@/components/sections/dashboard/performance-chart";
import { DashboardPriorityLeads } from "@/components/sections/dashboard/priority-leads";
import { DashboardStatsOverview } from "@/components/sections/dashboard/stats-overview";
import type { LeadPerformanceTrendPoint } from "@/lib/leads/chart-data";
import type { LeadDashboardMetrics } from "@/lib/leads/metrics";
import type { DashboardPriorityLeadItem } from "@/lib/leads/priority-dashboard";
import type { LeadPriorityActivityInput } from "@/lib/leads/priority-score";
import type { Lead } from "@/lib/lead-types";

type DashboardShellProps = {
  initialLeads: Lead[];
  metrics: LeadDashboardMetrics | null;
  metricsError?: string | null;
  performanceTrend: LeadPerformanceTrendPoint[] | null;
  chartError?: string | null;
  priorityLeads: DashboardPriorityLeadItem[];
  priorityLeadsError?: string | null;
  leadActivitiesByLeadId: Record<string, LeadPriorityActivityInput[]>;
  userLabel: string;
  leadsError?: string | null;
};

export function DashboardShell({
  initialLeads,
  metrics,
  metricsError,
  performanceTrend,
  chartError,
  priorityLeads,
  priorityLeadsError,
  leadActivitiesByLeadId,
  userLabel,
  leadsError,
}: DashboardShellProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  return (
    <div className="min-h-screen bg-transparent text-slate-950">
      <SiteHeader sessionUser={{ email: userLabel }} />
      <Container className="flex flex-col gap-6 py-8 sm:py-10">
        <DashboardHeroSection userLabel={userLabel} />
        <DashboardStatsOverview metrics={metrics} error={metricsError} />

        <DashboardPriorityLeads items={priorityLeads} error={priorityLeadsError} />

        <DashboardLeadsTable
          initialLeads={initialLeads}
          leadActivitiesByLeadId={leadActivitiesByLeadId}
          loadError={leadsError}
          onUseLead={setSelectedLead}
        />

        <div className="grid min-w-0 gap-6 lg:grid-cols-5">
          <div className="min-w-0 lg:col-span-3">
            <DashboardPerformanceChart data={performanceTrend} error={chartError} />
          </div>
          <div className="min-w-0 lg:col-span-2">
            <DashboardAiMessagePanel
              key={selectedLead?.id ?? "default-ai-message-panel"}
              selectedLead={selectedLead}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
