"use client";

import { motion } from "framer-motion";
import { statsCards } from "@/lib/mock-data";

export function StatsGrid() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statsCards.map((stat, index) => (
        <motion.article
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.08 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
        >
          <p className="text-sm text-slate-300">{stat.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {stat.value}
          </p>
          <p className="mt-2 text-sm text-emerald-300">{stat.delta} this month</p>
        </motion.article>
      ))}
    </section>
  );
}
