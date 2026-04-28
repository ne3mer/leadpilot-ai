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
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <h2 className="text-lg font-medium text-white">Lead Performance Trend</h2>
      <p className="mt-1 text-sm text-slate-300">
        Monthly leads and conversions powered by AI workflows.
      </p>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={pipelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="leads"
              stroke="#818cf8"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="conversions"
              stroke="#22d3ee"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
