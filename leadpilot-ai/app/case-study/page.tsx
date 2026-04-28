import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const keyFeatures = [
  "Interactive dashboard with real-time stats",
  "Lead management with local persistence",
  "Smart follow-up message generator",
  "Clean, responsive UI optimized for usability",
  "Scalable frontend architecture with reusable components",
];

const techStack = [
  "Next.js (App Router)",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "Recharts",
  "Lucide Icons",
  "localStorage for frontend data persistence",
];

const metrics = [
  {
    label: "Manual Follow-up Work",
    value: "~70% less",
    detail: "Simulated reduction through reusable AI-assisted templates",
  },
  {
    label: "Lead Response Rate",
    value: "+~25%",
    detail: "Simulated improvement from faster and more consistent follow-up",
  },
  {
    label: "Lead Tracking Speed",
    value: "Significantly faster",
    detail: "Status updates and lead organization from a single dashboard",
  },
  {
    label: "Pipeline Visibility",
    value: "Higher confidence",
    detail: "Clear KPI and chart-based overview for sales workflow decisions",
  },
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
              Portfolio SaaS MVP Case Study
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black md:text-5xl">
              LeadPilot AI - SaaS MVP for Sales Automation
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              A B2B company needed a faster way to follow up with leads after
              collecting contacts from trade shows and website forms. I designed
              and built a modern SaaS MVP focused on lead capture, pipeline
              clarity, and AI-assisted communication workflows.
            </p>
          </section>

          <section>
            <SectionHeading
              title="Project Overview"
              description="LeadPilot AI is a frontend SaaS MVP built to streamline lead management and accelerate sales follow-up execution."
              className="mb-5"
            />
            <Card className="p-6 text-slate-700">
              This product-style implementation demonstrates how I build
              production-grade SaaS interfaces for startups: structured codebase,
              reusable design system, conversion-focused UX, and realistic
              business flow representation for rapid validation.
            </Card>
          </section>

          <section>
            <SectionHeading
              title="Problem"
              description="Sales teams were manually tracking leads and handling follow-ups inconsistently."
              className="mb-5"
            />
            <Card className="p-6 text-slate-700">
              Without a central workflow, leads were scattered across spreadsheets
              and ad-hoc notes. Follow-up messages took time to craft, response
              times were delayed, and pipeline health was difficult to measure in
              one place.
            </Card>
          </section>

          <section>
            <SectionHeading
              title="Solution"
              description="I designed and developed a modern SaaS MVP for lead management and sales automation."
              className="mb-5"
            />
            <Card className="p-6 text-slate-700">
              The platform centralizes lead organization, status tracking,
              dashboard analytics, and AI-powered follow-up message generation
              based on tone and intent. It is optimized for clarity, speed, and a
              premium client-facing experience.
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
              title="Screenshots / Mock Dashboard Preview"
              description="Representative UI captures for portfolio presentation and client review."
              className="mb-5"
            />
            <Card className="p-6">
              <div className="grid gap-4 md:grid-cols-3">
                {["Landing Hero", "Lead Table", "AI Generator"].map((item) => (
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
              title="Results / Impact (Simulated Case Study)"
              description="Benchmark-style outcomes based on realistic usage scenarios."
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
              description="Roadmap to transition this MVP into a fully production-ready SaaS platform."
            />
            <Card className="p-6">
              <ul className="space-y-3 text-sm leading-6 text-slate-700">
                <li>- Authentication and multi-user workspaces</li>
                <li>- Backend APIs with database persistence</li>
                <li>- CRM integrations (HubSpot, Salesforce, Pipedrive)</li>
                <li>- Real AI model integration for context-aware generation</li>
                <li>- Advanced analytics and conversion attribution</li>
              </ul>
            </Card>
          </section>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
