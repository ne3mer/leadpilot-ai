import { NextResponse } from "next/server";
import { assertDeepSeekConfigured } from "@/lib/ai/config";
import { generateLeadPriorityExplanation } from "@/lib/ai/generate-lead-priority-explanation";
import { parseLeadPriorityExplanationRequestBody } from "@/lib/ai/validation";
import { getActivitiesForLeadForCurrentUser } from "@/lib/activities/repository";
import { computeLeadPriorityScore } from "@/lib/leads/priority-score";
import { getLeadByIdForCurrentUser } from "@/lib/leads/repository";
import { getSenderProfileForCurrentUser } from "@/lib/sender-profile/repository";
import { toSenderProfileForAI } from "@/lib/sender-profile-types";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError("You must be signed in.", 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const parsed = parseLeadPriorityExplanationRequestBody(body);
  if (!parsed.ok) {
    return jsonError(parsed.error, 400);
  }

  const { leadId } = parsed.data;

  let lead = null;
  try {
    lead = await getLeadByIdForCurrentUser(supabase, leadId);
  } catch {
    return jsonError("Lead not found.", 404);
  }

  if (!lead) {
    return jsonError("Lead not found.", 404);
  }

  try {
    assertDeepSeekConfigured();
  } catch {
    return jsonError("AI service is not configured.", 503);
  }

  let activities;
  try {
    activities = await getActivitiesForLeadForCurrentUser(supabase, leadId);
  } catch {
    return jsonError("Unable to generate priority explanation right now.", 502);
  }

  let senderProfile = null;
  try {
    const profile = await getSenderProfileForCurrentUser(supabase);
    senderProfile = profile ? toSenderProfileForAI(profile) : null;
  } catch {
    return jsonError("Unable to generate priority explanation right now.", 502);
  }

  const activityContext = activities.map((activity) => ({
    type: activity.type,
    content: activity.content,
    created_at: activity.created_at,
  }));

  const priorityResult = computeLeadPriorityScore(
    {
      status: lead.status,
      created_at: lead.created_at,
      updated_at: lead.updated_at,
    },
    activityContext
  );

  try {
    const result = await generateLeadPriorityExplanation({
      lead: {
        name: lead.name,
        company: lead.company,
        status: lead.status,
        created_at: lead.created_at,
        updated_at: lead.updated_at,
      },
      activities: activityContext,
      senderProfile,
      priorityResult,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "AI_NOT_CONFIGURED") {
        return jsonError("AI service is not configured.", 503);
      }
      if (error.message === "AI_INVALID_RESPONSE" || error.message === "AI_EMPTY_RESPONSE") {
        return jsonError("Unable to generate a valid priority explanation.", 502);
      }
    }

    return jsonError("Unable to generate priority explanation right now.", 502);
  }
}
