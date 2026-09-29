import { notFound, redirect } from "next/navigation";
import { LeadDetailPanel } from "@/app/dashboard/leads/[id]/lead-detail-panel";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/ui/container";
import { getLeadByIdForCurrentUser } from "@/lib/leads/repository";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let lead = null;

  try {
    lead = await getLeadByIdForCurrentUser(supabase, id);
  } catch {
    notFound();
  }

  if (!lead) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-950">
      <SiteHeader sessionUser={{ email: user.email ?? "Signed in" }} />
      <Container className="py-8 sm:py-10">
        <LeadDetailPanel key={`${lead.id}-${lead.updated_at}`} lead={lead} />
      </Container>
    </div>
  );
}
