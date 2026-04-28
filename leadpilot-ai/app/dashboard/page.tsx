import { AIMessageGenerator } from "@/components/dashboard/ai-message-generator";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { Navbar } from "@/components/navbar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 lg:px-8">
        <header className="rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-500/20 via-slate-900 to-cyan-500/20 p-6">
          <p className="text-sm uppercase tracking-[0.16em] text-indigo-200">
            LeadPilot Command Center
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-slate-300">
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
