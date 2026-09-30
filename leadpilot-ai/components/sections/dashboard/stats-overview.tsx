"use client";

import { formatConversionRate, type LeadDashboardMetrics } from "@/lib/leads/metrics";
type DashboardStatsOverviewProps = {
  metrics: LeadDashboardMetrics | null;
  error?: string | null;
};

function InlineAlert({
  tone,
  children,
}: {
  tone: "error" | "muted";
  children: React.ReactNode;
}) {
  const classes =
    tone === "error"
      ? "border-danger/20 bg-danger-muted text-danger"
      : "border-border bg-surface-subtle text-secondary";
  return (
    <p className={`rounded-sm border px-3 py-2 lp-text-body-small ${classes}`} role="status">
      {children}
    </p>
  );
}

export function DashboardStatsOverview({ metrics, error }: DashboardStatsOverviewProps) {
  if (error) {
    return (
      <section aria-label="Pipeline summary">
        <InlineAlert tone="error">{error}</InlineAlert>
      </section>
    );
  }

  if (!metrics) {
    return (
      <section aria-label="Pipeline summary">
        <InlineAlert tone="muted">Loading pipeline summary…</InlineAlert>
      </section>
    );
  }

  return <DashboardStatsStrip metrics={metrics} />;
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="lp-text-caption text-muted">{label}</p>
      <p className="mt-0.5 tabular-nums lp-text-subsection text-primary">{value}</p>
    </div>
  );
}

function DashboardStatsStrip({ metrics }: { metrics: LeadDashboardMetrics }) {
  const activePipeline =
    metrics.new +
    metrics.contacted +
    metrics.qualified +
    metrics.proposalSent +
    metrics.negotiation;

  const pipelineParts = [
    { label: "New", value: metrics.new },
    { label: "Contacted", value: metrics.contacted },
    { label: "Qualified", value: metrics.qualified },
    { label: "Proposal", value: metrics.proposalSent },
    { label: "Negotiation", value: metrics.negotiation },
  ];

  return (
    <section aria-label="Pipeline summary" className="min-w-0 border-y border-border py-[var(--lp-space-5)]">
      <div className="grid gap-[var(--lp-space-6)] sm:grid-cols-2 lg:grid-cols-4">
        <SummaryStat label="Total leads" value={String(metrics.totalLeads)} />
        <SummaryStat label="Active in pipeline" value={String(activePipeline)} />
        <SummaryStat label="Won · Lost" value={`${metrics.won} · ${metrics.lost}`} />
        <SummaryStat
          label="Conversion (Won ÷ total)"
          value={formatConversionRate(metrics.conversionRatePercent)}
        />
      </div>
      <div className="mt-[var(--lp-space-5)] min-w-0">
        <p className="lp-text-caption text-muted">Pipeline distribution</p>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 lp-text-body-small text-secondary">
          {pipelineParts.map((part) => (
            <span key={part.label} className="tabular-nums">
              {part.label}{" "}
              <span className="font-medium text-primary">{part.value}</span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
