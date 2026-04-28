import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const keyFeatures = [
  "Lead management dashboard with localStorage persistence",
  "Template-driven AI follow-up message generator",
  "Interactive KPI cards, charting, and pipeline table",
  "Clean modular architecture with reusable UI primitives",
  "Responsive premium UI optimized for desktop and mobile",
];

const techStack = [
  "Next.js (App Router)",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "Recharts",
  "Lucide Icons",
  "localStorage for frontend persistence",
];

const metrics = [
  { label: "Lead Data Entry Time", value: "-46%", detail: "from 5.2 min to 2.8 min per lead" },
  { label: "Follow-up Draft Speed", value: "3.4x", detail: "faster message preparation for SDRs" },
  { label: "Pipeline Visibility", value: "+58%", detail: "improved weekly reporting confidence" },
  { label: "Demo-to-Proposal Progression", value: "+22%", detail: "simulated uplift from consistent follow-ups" },
];

export default function CaseStudyPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-950">
      <SiteHeader />

      <main className="py-12">
        <Container className="flex flex-col gap-10">
          <section className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-500/15 blur-3xl" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              SaaS MVP Case Study
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black md:text-5xl">
              LeadPilot AI - Portfolio Build for Modern Sales Teams
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              This project demonstrates how I design and ship premium SaaS MVPs with
              strong UX foundations, modular frontend architecture, and practical
              business-oriented features suitable for fast client validation.
            </p>
          </section>

          <section>
            <SectionHeading
              title="Project Overview"
              description="LeadPilot AI is a frontend SaaS MVP designed to help sales teams manage leads, track pipeline health, and produce high-quality AI-assisted follow-up messages in minutes."
              className="mb-5"
            />
            <Card className="p-6 text-slate-700">
              The goal was to build a realistic product-style dashboard experience
              that feels production-ready for demos, investor presentations, and
              early customer discovery. The implementation focuses on polished UI,
              scalability of code structure, and practical feature behavior.
            </Card>
          </section>

          <section>
            <SectionHeading
              title="Problem"
              description="Early-stage sales teams often struggle with fragmented lead tracking and inconsistent follow-up quality."
              className="mb-5"
            />
            <Card className="p-6 text-slate-700">
              Many founders and small GTM teams rely on spreadsheets and manual
              communication templates. This creates inconsistent process execution,
              slower response times, and low visibility across the pipeline. They
              need a lightweight but premium system to centralize lead workflows
              before investing in enterprise-grade tooling.
            </Card>
          </section>

          <section>
            <SectionHeading
              title="Solution"
              description="I delivered a premium, lightweight CRM-style MVP with guided follow-up generation and persistent lead workflows."
              className="mb-5"
            />
            <Card className="p-6 text-slate-700">
              The solution combines a clean sales dashboard with local persistence,
              dynamic lead status management, and template-based messaging aligned
              to tone and business objective. The result is an MVP that is both
              demo-friendly and functionally useful for early operations.
            </Card>
          </section>

          <section>
            <SectionHeading title="Key Features" className="mb-5" />
            <div className="grid gap-4 md:grid-cols-2">
              {keyFeatures.map((feature) => (
                <Card key={feature} className="p-5 text-sm leading-6 text-slate-700">
                  {feature}
                </Card>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading title="Tech Stack" className="mb-5" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {techStack.map((item) => (
                <Card key={item} className="p-4 text-sm font-medium text-slate-700">
                  {item}
                </Card>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading
              title="Screenshots / Dashboard Preview"
              description="Representative interface blocks from the implemented MVP design system."
              className="mb-5"
            />
            <Card className="p-6">
              <div className="grid gap-4 md:grid-cols-3">
                {["KPI Overview", "Lead Pipeline", "AI Follow-up Box"].map((item) => (
                  <div key={item} className="rounded-2xl border border-black/10 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{item}</p>
                    <div className="mt-3 h-24 rounded-xl bg-gradient-to-r from-emerald-200 via-emerald-100 to-white" />
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-black/10 bg-slate-50 p-5">
                <div className="h-40 rounded-xl bg-gradient-to-r from-black/90 via-emerald-700 to-emerald-500" />
              </div>
            </Card>
          </section>

          <section>
            <SectionHeading
              title="Results / Impact (Simulated)"
              description="Realistic benchmark-style outcomes based on MVP usage scenarios."
              className="mb-5"
            />
            <div className="grid gap-4 md:grid-cols-2">
              {metrics.map((metric) => (
                <Card key={metric.label} className="p-5">
                  <p className="text-sm text-slate-600">{metric.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-black">{metric.value}</p>
                  <p className="mt-2 text-sm text-emerald-700">{metric.detail}</p>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading
              title="What I Would Build Next"
              className="mb-5"
              description="Planned roadmap to evolve this MVP into a production SaaS product."
            />
            <Card className="p-6">
              <ul className="space-y-3 text-sm leading-6 text-slate-700">
                <li>- Backend services with secure auth and role-based access control</li>
                <li>- Database-backed lead records with team workspaces and activity logs</li>
                <li>- Real AI provider integration for context-aware follow-up generation</li>
                <li>- CRM integrations (HubSpot, Salesforce, Pipedrive)</li>
                <li>- Analytics layer for conversion attribution and revenue forecasting</li>
              </ul>
            </Card>
          </section>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
