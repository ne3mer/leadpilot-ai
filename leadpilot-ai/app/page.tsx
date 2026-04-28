import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LandingDashboardPreviewSection } from "@/components/sections/landing/dashboard-preview";
import { LandingFeaturesSection } from "@/components/sections/landing/features";
import { LandingHeroSection } from "@/components/sections/landing/hero";
import { LandingPricingSection } from "@/components/sections/landing/pricing";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-slate-950">
      <SiteHeader />
      <main>
        <LandingHeroSection />
        <LandingDashboardPreviewSection />
        <LandingFeaturesSection />
        <LandingPricingSection />
      </main>
      <SiteFooter />
    </div>
  );
}
