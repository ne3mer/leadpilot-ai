import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/ui/container";
import { DashboardAiMessagePanel } from "@/components/sections/dashboard/ai-message-panel";
import { DashboardHeroSection } from "@/components/sections/dashboard/dashboard-hero";
import { DashboardLeadsTable } from "@/components/sections/dashboard/leads-table";
import { DashboardPerformanceChart } from "@/components/sections/dashboard/performance-chart";
import { DashboardStatsOverview } from "@/components/sections/dashboard/stats-overview";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-950">
      <SiteHeader />
      <Container className="flex flex-col gap-6 py-10">
        <DashboardHeroSection />
        <DashboardStatsOverview />

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <DashboardPerformanceChart />
          </div>
          <div className="lg:col-span-2">
            <DashboardAiMessagePanel />
          </div>
        </div>

        <DashboardLeadsTable />
      </Container>
    </div>
  );
}
