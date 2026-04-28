"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { pricingTiers } from "@/lib/mock-data";

export function PricingSection() {
  return (
    <section id="pricing" className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-black">
            Flexible plans for every growth stage
          </h2>
          <p className="mt-3 text-slate-600">
            Scale from first conversion experiments to enterprise-grade revenue
            orchestration.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className={`rounded-2xl border p-6 ${
                tier.featured
                  ? "border-emerald-600/40 bg-emerald-50"
                  : "border-black/10 bg-white"
              }`}
            >
              <tier.icon className="h-5 w-5 text-emerald-700" />
              <h3 className="mt-4 text-xl font-semibold text-black">{tier.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{tier.description}</p>
              <p className="mt-4 text-3xl font-bold text-black">
                {tier.price}
                <span className="ml-1 text-base font-medium text-slate-600">
                  {tier.period}
                </span>
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {tier.features.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-700" />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="mt-8 w-full rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Choose {tier.name}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
