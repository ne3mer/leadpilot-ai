"use client";

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

export function PerformanceChart() {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5">
      <h2 className="text-lg font-medium text-black">Lead Performance Trend</h2>
      <p className="mt-1 text-sm text-slate-600">
        Monthly leads and conversions powered by AI workflows.
      </p>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
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
            <Line
              type="monotone"
              dataKey="leads"
              stroke="#111827"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="conversions"
              stroke="#16a34a"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
