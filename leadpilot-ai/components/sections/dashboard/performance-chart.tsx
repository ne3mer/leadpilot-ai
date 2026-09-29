"use client";

import { useSyncExternalStore } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { pipelineData } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";

function ChartSkeleton() {
  return (
    <div
      className="flex h-full min-h-[18rem] w-full min-w-0 items-end gap-2 rounded-xl border border-black/5 bg-slate-50 px-4 py-6"
      aria-hidden
    >
      {[40, 55, 48, 62, 58, 72].map((height, index) => (
        <div
          key={index}
          className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-200/80 to-emerald-100/40"
          style={{ height: `${height}%` }}
        />
      ))}
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

export function DashboardPerformanceChart() {
  const isClient = useIsClient();

  return (
    <Card className="p-5">
      <h2 className="text-lg font-medium text-black">Lead Performance Trend</h2>
      <p className="mt-1 text-sm text-slate-600">
        Demo trend data only — not connected to your account leads yet.
      </p>

      <div className="mt-6 h-72 min-h-[18rem] w-full min-w-0">
        {isClient ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={pipelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis dataKey="month" stroke="#475569" />
              <YAxis stroke="#475569" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #d1d5db",
                  borderRadius: "12px",
                }}
              />
              <Line type="monotone" dataKey="leads" stroke="#111827" strokeWidth={3} dot={false} />
              <Line
                type="monotone"
                dataKey="conversions"
                stroke="#16a34a"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ChartSkeleton />
        )}
      </div>
    </Card>
  );
}
