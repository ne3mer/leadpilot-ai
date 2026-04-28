"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { pricingTiers } from "@/lib/mock-data";

export function PricingSection() {
  return (
    <section id="pricing" className="px-6 py-18 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
            Flexible plans for every growth stage
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
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
              whileHover={{ y: -8 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className={`relative overflow-hidden rounded-3xl border p-7 transition duration-300 ${
                tier.featured
                  ? "border-emerald-500/30 bg-gradient-to-b from-emerald-50 to-white shadow-[0_24px_44px_-28px_rgba(22,163,74,0.55)]"
                  : "border-black/10 bg-white shadow-sm hover:shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)]"
              }`}
            >
              {tier.featured ? (
                <div className="absolute right-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                  Popular
                </div>
              ) : null}

              <tier.icon className="h-5 w-5 text-emerald-700" />
              <h3 className="mt-4 text-xl font-semibold text-black">{tier.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{tier.description}</p>
              <p className="mt-5 text-4xl font-semibold tracking-tight text-black">
                {tier.price}
                <span className="ml-1 text-base font-medium text-slate-600">
                  {tier.period}
                </span>
              </p>

              <ul className="mt-7 space-y-3 text-sm text-slate-700">
                {tier.features.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-700" />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`mt-9 w-full rounded-xl px-4 py-3 text-sm font-semibold transition duration-300 ${
                  tier.featured
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-[0_10px_24px_-12px_rgba(22,163,74,0.6)] hover:from-emerald-700 hover:to-emerald-600"
                    : "bg-black text-white hover:bg-emerald-700"
                }`}
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
