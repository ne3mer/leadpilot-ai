"use client";

import { motion } from "framer-motion";
import { formatConversionRate, type LeadDashboardMetrics } from "@/lib/leads/metrics";
import { Card } from "@/components/ui/card";

type DashboardStatsOverviewProps = {
  metrics: LeadDashboardMetrics | null;
  error?: string | null;
};

type MetricCard = {
  label: string;
  value: string;
  detail: string;
};

function buildMetricCards(metrics: LeadDashboardMetrics): MetricCard[] {
  return [
    {
      label: "Total Leads",
      value: String(metrics.totalLeads),
      detail: "All leads in your workspace",
    },
    {
      label: "Conversion Rate",
      value: formatConversionRate(metrics.conversionRatePercent),
      detail: "Won ÷ total leads",
    },
    {
      label: "New",
      value: String(metrics.new),
      detail: "Pipeline: New",
    },
    {
      label: "Contacted",
      value: String(metrics.contacted),
      detail: "Pipeline: Contacted",
    },
    {
      label: "Qualified",
      value: String(metrics.qualified),
      detail: "Pipeline: Qualified",
    },
    {
      label: "Proposal Sent",
      value: String(metrics.proposalSent),
      detail: "Pipeline: Proposal Sent",
    },
    {
      label: "Negotiation",
      value: String(metrics.negotiation),
      detail: "Pipeline: Negotiation",
    },
    {
      label: "Won",
      value: String(metrics.won),
      detail: "Terminal: Won",
    },
    {
      label: "Lost",
      value: String(metrics.lost),
      detail: "Terminal: Lost",
    },
  ];
}

export function DashboardStatsOverview({ metrics, error }: DashboardStatsOverviewProps) {
  if (error) {
    return (
      <section aria-label="Pipeline KPI metrics">
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      </section>
    );
  }

  if (!metrics) {
    return (
      <section aria-label="Pipeline KPI metrics">
        <p className="rounded-xl border border-black/10 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Loading pipeline metrics…
        </p>
      </section>
    );
  }

  const cards = buildMetricCards(metrics);

  return (
    <section aria-label="Pipeline KPI metrics">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((stat, index) => (
          <motion.article
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -6 }}
            className="group"
          >
            <Card className="relative overflow-hidden p-6 transition duration-300 hover:shadow-[0_24px_45px_-28px_rgba(15,23,42,0.45)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-300 to-transparent opacity-85" />
              <p className="text-sm font-medium text-slate-600">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-black lg:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-emerald-700">{stat.detail}</p>
            </Card>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
