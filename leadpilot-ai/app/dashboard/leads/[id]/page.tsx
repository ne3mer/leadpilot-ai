import { notFound, redirect } from "next/navigation";
import { LeadDetailPanel } from "@/app/dashboard/leads/[id]/lead-detail-panel";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/ui/container";
import type { LeadActivity } from "@/lib/activity-types";
import { getActivitiesForLeadForCurrentUser } from "@/lib/activities/repository";
import { computeLeadPriorityScore } from "@/lib/leads/priority-score";
import type { LeadPriorityScoreResult } from "@/lib/leads/priority-types";
import { getLeadByIdForCurrentUser } from "@/lib/leads/repository";
import { getSenderProfileForCurrentUser } from "@/lib/sender-profile/repository";
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

  let activities: LeadActivity[] = [];
  let hasSenderProfile = false;
  try {
    const [loadedActivities, profile] = await Promise.all([
      getActivitiesForLeadForCurrentUser(supabase, lead.id),
      getSenderProfileForCurrentUser(supabase),
    ]);
    activities = loadedActivities;
    hasSenderProfile = profile !== null;
  } catch {
    notFound();
  }

  const activityContext = activities.map((activity) => ({
    type: activity.type,
    content: activity.content,
    created_at: activity.created_at,
  }));

  const priorityResult: LeadPriorityScoreResult = computeLeadPriorityScore(
    {
      status: lead.status,
      created_at: lead.created_at,
      updated_at: lead.updated_at,
    },
    activityContext
  );

  return (
    <div className="min-h-screen bg-transparent text-slate-950">
      <SiteHeader sessionUser={{ email: user.email ?? "Signed in" }} />
      <Container className="py-8 sm:py-10">
        <LeadDetailPanel
          key={`${lead.id}-${lead.updated_at}`}
          lead={lead}
          activities={activities}
          priorityResult={priorityResult}
          hasSenderProfile={hasSenderProfile}
        />
      </Container>
    </div>
  );
}
