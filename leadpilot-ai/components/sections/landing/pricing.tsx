"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { pricingTiers } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

export function LandingPricingSection() {
  return (
    <section id="pricing" className="py-18">
      <Container className="max-w-6xl">
        <SectionHeading
          centered
          title="Flexible plans for every growth stage"
          description="Scale from first conversion experiments to enterprise-grade revenue orchestration."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <Card
                className={cn(
                  "relative overflow-hidden rounded-3xl p-7 transition duration-300",
                  tier.featured
                    ? "border-emerald-500/30 bg-gradient-to-b from-emerald-50 to-white shadow-[0_24px_44px_-28px_rgba(22,163,74,0.55)]"
                    : "hover:shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)]"
                )}
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

                <div className="mt-9">
                  <Button
                    variant={tier.featured ? "primary" : "dark"}
                    className="w-full rounded-xl px-4 py-3"
                  >
                    Choose {tier.name}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
