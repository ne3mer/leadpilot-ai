import { Card } from "@/components/ui/card";

export function DashboardHeroSection() {
  return (
    <Card className="relative overflow-hidden rounded-3xl p-7">
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl" />
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
        LeadPilot Command Center
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black md:text-4xl">
        Dashboard
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Track lead velocity, conversion performance, and AI-generated actions.
      </p>
    </Card>
  );
}
