"use client";

import { motion } from "framer-motion";
import { statsCards } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";

export function DashboardStatsOverview() {
  return (
    <section aria-label="Demo KPI metrics">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900">
          Demo metrics
        </span>
        <p className="text-sm text-slate-600">
          Static sample KPIs until real analytics ship in a later phase.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {statsCards.map((stat, index) => (
        <motion.article
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.09 }}
          whileHover={{ y: -6 }}
          className="group"
        >
          <Card className="relative overflow-hidden p-6 transition duration-300 hover:shadow-[0_24px_45px_-28px_rgba(15,23,42,0.45)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-300 to-transparent opacity-85" />
            <p className="text-sm font-medium text-slate-600">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-black lg:text-4xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm font-medium text-emerald-700">
              {stat.delta} this month
            </p>
          </Card>
        </motion.article>
      ))}
      </div>
    </section>
  );
}
