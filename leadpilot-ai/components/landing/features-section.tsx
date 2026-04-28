"use client";

import { motion } from "framer-motion";
import { featureItems } from "@/lib/mock-data";

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold tracking-tight text-black">
            Built for modern sales execution
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Everything your GTM team needs to identify high-intent prospects and
            move them through the funnel faster.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {featureItems.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              className="rounded-2xl border border-black/10 bg-white p-6"
            >
              <feature.icon className="h-6 w-6 text-emerald-700" />
              <h3 className="mt-4 text-xl font-medium text-black">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
