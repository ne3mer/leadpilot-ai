"use client";

import { motion } from "framer-motion";
import { featureItems } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export function LandingFeaturesSection() {
  return (
    <section id="features" className="py-16">
      <Container className="max-w-6xl">
        <SectionHeading
          title="Built for modern sales execution"
          description="Everything your GTM team needs to identify high-intent prospects and move them through the funnel faster."
          className="mb-10"
        />

        <div className="grid gap-5 md:grid-cols-2">
          {featureItems.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
            >
              <Card className="p-6">
                <feature.icon className="h-6 w-6 text-emerald-700" />
                <h3 className="mt-4 text-xl font-medium text-black">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
