import { redirect } from "next/navigation";
import { SenderProfileForm } from "@/components/sections/dashboard/sender-profile-form";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/ui/container";
import { getSenderProfileForCurrentUser } from "@/lib/sender-profile/repository";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SenderProfileSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let profile = null;
  try {
    profile = await getSenderProfileForCurrentUser(supabase);
  } catch {
    profile = null;
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-950">
      <SiteHeader sessionUser={{ email: user.email ?? "Signed in" }} />
      <Container className="py-8 sm:py-10">
        <SenderProfileForm initialProfile={profile} />
      </Container>
    </div>
  );
}
