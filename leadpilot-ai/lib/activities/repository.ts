import type { SupabaseClient } from "@supabase/supabase-js";
import type { LeadActivity, LeadActivityType } from "@/lib/activity-types";
import type { Database } from "@/lib/database.types";
import {
  getLeadByIdForCurrentUser,
  requireAuthenticatedUser,
} from "@/lib/leads/repository";

type SupabaseServerClient = SupabaseClient<Database>;

const activityColumns = "id, lead_id, user_id, type, content, created_at" as const;

function mapActivity(row: Database["public"]["Tables"]["lead_activities"]["Row"]): LeadActivity {
  return row;
}

/** All activities for the signed-in user (single query; RLS-scoped). */
export async function listActivitiesForCurrentUser(
  supabase: SupabaseServerClient
): Promise<LeadActivity[]> {
  await requireAuthenticatedUser(supabase);

  const { data, error } = await supabase
    .from("lead_activities")
    .select(activityColumns)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Unable to load activities.");
  }

  return (data ?? []).map(mapActivity);
}

export async function getActivitiesForLeadForCurrentUser(
  supabase: SupabaseServerClient,
  leadId: string
): Promise<LeadActivity[]> {
  const lead = await getLeadByIdForCurrentUser(supabase, leadId);
  if (!lead) {
    throw new Error("Lead not found.");
  }

  const { data, error } = await supabase
    .from("lead_activities")
    .select(activityColumns)
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Unable to load activities.");
  }

  return (data ?? []).map(mapActivity);
}

export async function createActivityForCurrentUser(
  supabase: SupabaseServerClient,
  leadId: string,
  input: { type: LeadActivityType; content: string }
): Promise<LeadActivity> {
  const user = await requireAuthenticatedUser(supabase);
  const lead = await getLeadByIdForCurrentUser(supabase, leadId);
  if (!lead) {
    throw new Error("Lead not found.");
  }

  const { data, error } = await supabase
    .from("lead_activities")
    .insert({
      lead_id: leadId,
      user_id: user.id,
      type: input.type,
      content: input.content.trim(),
    })
    .select(activityColumns)
    .single();

  if (error) {
    throw new Error("Unable to create activity.");
  }

  return mapActivity(data);
}

export async function updateActivityForCurrentUser(
  supabase: SupabaseServerClient,
  activityId: string,
  input: { type: LeadActivityType; content: string }
): Promise<LeadActivity> {
  await requireAuthenticatedUser(supabase);

  const { data, error } = await supabase
    .from("lead_activities")
    .update({
      type: input.type,
      content: input.content.trim(),
    })
    .eq("id", activityId)
    .select(activityColumns)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to update activity.");
  }

  if (!data) {
    throw new Error("Activity not found.");
  }

  return mapActivity(data);
}

export async function deleteActivityForCurrentUser(
  supabase: SupabaseServerClient,
  activityId: string
): Promise<void> {
  await requireAuthenticatedUser(supabase);

  const { data, error } = await supabase
    .from("lead_activities")
    .delete()
    .eq("id", activityId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error("Unable to delete activity.");
  }

  if (!data) {
    throw new Error("Activity not found.");
  }
}
