import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SignalVisualLab } from "@/components/visual/signal/signal-visual-lab";
import { Container } from "@/components/ui/container";
import { typographyClass } from "@/lib/design-system/typography";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DesignLabPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-page pb-20 text-primary md:pb-0">
      <SiteHeader sessionUser={{ email: user.email ?? "Signed in" }} />
      <Container className="py-[var(--lp-space-10)]">
        <header className="mb-[var(--lp-space-section)] max-w-prose">
          <p className="lp-text-caption text-muted">Development only</p>
          <h1 className={typographyClass("pageTitle", "mt-1")}>Signal design lab</h1>
          <p className={typographyClass("bodySmall", "mt-2")}>
            Evaluate LeadPilot&apos;s signature visual language before broader rollout. Not listed in
            navigation.
          </p>
        </header>
        <SignalVisualLab />
      </Container>
    </div>
  );
}
