"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-20 lg:px-8">
      <div className="pointer-events-none absolute -top-44 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-4 inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-emerald-700"
        >
          New Era Lead Automation
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-balance text-4xl font-semibold tracking-tight text-black sm:text-5xl lg:text-6xl"
        >
          AI-powered CRM for faster lead conversion
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-slate-600 sm:text-lg"
        >
          LeadPilot AI helps sales teams qualify leads, automate personalized
          follow-ups, and close more deals with predictive pipeline insights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Start Free Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold text-black transition hover:border-emerald-600 hover:text-emerald-700"
          >
            View Dashboard
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
