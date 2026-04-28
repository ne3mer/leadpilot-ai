"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function LandingHeroSection() {
  return (
    <section className="relative overflow-hidden pb-20 pt-24 lg:pt-28">
      <div className="pointer-events-none absolute -top-56 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-emerald-500/25 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-8rem] top-14 h-72 w-72 rounded-full bg-black/10 blur-[90px]" />

      <Container className="max-w-5xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6 inline-flex items-center rounded-full border border-emerald-700/20 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800 shadow-sm"
        >
          New Era Lead Automation
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="text-balance text-4xl font-semibold leading-tight tracking-tight text-black sm:text-5xl lg:text-7xl"
        >
          AI-powered CRM for faster lead conversion
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mx-auto mt-7 max-w-3xl text-pretty text-lg leading-8 text-slate-600"
        >
          LeadPilot AI helps sales teams qualify leads, automate personalized
          follow-ups, and close more deals with predictive pipeline insights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/login">
            <Button>
              Start Free Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary">View Dashboard</Button>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
