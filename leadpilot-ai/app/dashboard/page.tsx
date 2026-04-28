import { AIMessageGenerator } from "@/components/dashboard/ai-message-generator";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { Navbar } from "@/components/navbar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-950">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 lg:px-8">
        <header className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-7 shadow-sm">
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
        </header>

        <StatsGrid />

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <PerformanceChart />
          </div>
          <div className="lg:col-span-2">
            <AIMessageGenerator />
          </div>
        </div>

        <LeadsTable />
      </main>
    </div>
  );
}
