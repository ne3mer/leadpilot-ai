import { Footer } from "@/components/footer";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { Navbar } from "@/components/navbar";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <Navbar />
      <main>
        <HeroSection />
        <DashboardPreview />
        <FeaturesSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
