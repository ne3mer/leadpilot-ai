"use client";

import { useSyncExternalStore } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LeadPerformanceTrendPoint } from "@/lib/leads/chart-data";
import { typographyClass } from "@/lib/design-system/typography";

type DashboardPerformanceChartProps = {
  data: LeadPerformanceTrendPoint[] | null;
  error?: string | null;
};

const CHART_ACCENT = "var(--lp-accent)";
const CHART_PRIMARY = "var(--lp-text-primary)";
const CHART_MUTED = "var(--lp-text-muted)";
const CHART_BORDER = "var(--lp-border-subtle)";

function ChartPlaceholder() {
  return (
    <div
      className="flex h-full min-h-[14rem] w-full min-w-0 items-center justify-center rounded-sm border border-border bg-surface-subtle"
      role="status"
      aria-live="polite"
    >
      <p className="lp-text-body-small text-muted">Loading trend…</p>
    </div>
  );
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function DashboardPerformanceChart({ data, error }: DashboardPerformanceChartProps) {
  const isClient = useIsClient();

  return (
    <section aria-label="Lead performance trend" className="min-w-0">
      <header className="mb-[var(--lp-space-6)] max-w-prose">
        <h2 className={typographyClass("sectionTitle")}>Performance trend</h2>
        <p className={typographyClass("bodySmall", "mt-2")}>
          Leads created and Won outcomes by month (last 6 months, UTC). Won reflects current
          status only.
        </p>
      </header>

      {error ? (
        <p className="rounded-sm border border-danger/20 bg-danger-muted px-3 py-2 lp-text-body-small text-danger">
          {error}
        </p>
      ) : null}

      <div className="h-64 min-h-[14rem] w-full min-w-0 sm:h-72">
        {error ? null : isClient && data ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={CHART_BORDER} strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: CHART_MUTED, fontSize: 12 }}
                axisLine={{ stroke: CHART_BORDER }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: CHART_MUTED, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--lp-bg-surface)",
                  border: `1px solid ${CHART_BORDER}`,
                  borderRadius: "var(--lp-radius-sm)",
                  fontSize: 13,
                  color: CHART_PRIMARY,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, color: CHART_MUTED, paddingTop: 12 }}
                iconType="plainline"
              />
              <Line
                type="monotone"
                name="Leads created"
                dataKey="leads"
                stroke={CHART_PRIMARY}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3 }}
              />
              <Line
                type="monotone"
                name="Won (current status)"
                dataKey="won"
                stroke={CHART_ACCENT}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ChartPlaceholder />
        )}
      </div>
    </section>
  );
}
