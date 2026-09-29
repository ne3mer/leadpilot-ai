import { NextResponse } from "next/server";
import { assertDeepSeekConfigured } from "@/lib/ai/config";
import { generateLeadFollowUp } from "@/lib/ai/generate-lead-follow-up";
import { parseLeadFollowUpRequestBody } from "@/lib/ai/validation";
import { getLeadByIdForCurrentUser } from "@/lib/leads/repository";
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

  const parsed = parseLeadFollowUpRequestBody(body);
  if (!parsed.ok) {
    return jsonError(parsed.error, 400);
  }

  const { leadId, tone, objective } = parsed.data;

  let lead = null;
  try {
    lead = await getLeadByIdForCurrentUser(supabase, leadId);
  } catch {
    return jsonError("Unable to load lead.", 404);
  }

  if (!lead) {
    return jsonError("Lead not found.", 404);
  }

  try {
    assertDeepSeekConfigured();
  } catch {
    return jsonError("AI service is not configured.", 503);
  }

  try {
    const result = await generateLeadFollowUp({
      lead: {
        name: lead.name,
        company: lead.company,
        email: lead.email,
        status: lead.status,
      },
      tone,
      objective,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "AI_NOT_CONFIGURED") {
        return jsonError("AI service is not configured.", 503);
      }
      if (error.message === "AI_INVALID_RESPONSE" || error.message === "AI_EMPTY_RESPONSE") {
        return jsonError("Unable to generate a valid follow-up message.", 502);
      }
    }

    return jsonError("Unable to generate follow-up message right now.", 502);
  }
}
