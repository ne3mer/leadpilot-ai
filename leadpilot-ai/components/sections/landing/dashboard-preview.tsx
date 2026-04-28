"use client";

import { motion } from "framer-motion";
import { Activity, Bell, PieChart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export function LandingDashboardPreviewSection() {
  return (
    <section className="py-12">
      <Container className="max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
        >
          <Card className="rounded-3xl p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-medium text-black">Dashboard Preview</h2>
              <div className="flex items-center gap-2 text-slate-500">
                <Bell className="h-4 w-4" />
                <Activity className="h-4 w-4" />
                <PieChart className="h-4 w-4" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Qualified Leads", value: "2,430" },
                { label: "Meetings Booked", value: "614" },
                { label: "Pipeline", value: "$1.2M" },
              ].map((metric) => (
                <Card key={metric.label} className="bg-slate-50 p-4 shadow-none">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-black">{metric.value}</p>
                </Card>
              ))}
            </div>

            <Card className="mt-5 bg-slate-50 p-5 shadow-none">
              <div className="h-36 rounded-xl bg-gradient-to-r from-emerald-200 via-emerald-100 to-white" />
            </Card>
          </Card>
        </motion.div>
      </Container>
    </section>
  );
}
