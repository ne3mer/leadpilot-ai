"use server";

import { revalidatePath } from "next/cache";
import {
  createActivityForCurrentUser,
  deleteActivityForCurrentUser,
  updateActivityForCurrentUser,
} from "@/lib/activities/repository";
import {
  isValidActivityId,
  isValidLeadId,
  validateActivityFields,
} from "@/lib/activities/validation";
import type { LeadActivity, LeadActivityType } from "@/lib/activity-types";
import type { ActionResult } from "@/lib/leads/actions";
import { createClient } from "@/lib/supabase/server";

function revalidateLeadDetail(leadId: string) {
  revalidatePath(`/dashboard/leads/${leadId}`);
}

function mapActivityActionError(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const message = error.message;
  if (
    message === "Lead not found." ||
    message === "Activity not found." ||
    message === "Unauthorized"
  ) {
    return message === "Unauthorized" ? "You must be signed in to continue." : message;
  }

  return fallback;
}

export async function createLeadActivityAction(
  leadId: string,
  input: { type: LeadActivityType; content: string }
): Promise<ActionResult<LeadActivity>> {
  if (!isValidLeadId(leadId)) {
    return { success: false, error: "Invalid lead." };
  }

  const validationError = validateActivityFields(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const supabase = await createClient();
    const activity = await createActivityForCurrentUser(supabase, leadId, input);
    revalidateLeadDetail(leadId);
    return { success: true, data: activity };
  } catch (error) {
    return {
      success: false,
      error: mapActivityActionError(error, "Unable to create activity."),
    };
  }
}

export async function updateLeadActivityAction(
  leadId: string,
  activityId: string,
  input: { type: LeadActivityType; content: string }
): Promise<ActionResult<LeadActivity>> {
  if (!isValidLeadId(leadId) || !isValidActivityId(activityId)) {
    return { success: false, error: "Invalid activity." };
  }

  const validationError = validateActivityFields(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const supabase = await createClient();
    const activity = await updateActivityForCurrentUser(supabase, activityId, input);
    if (activity.lead_id !== leadId) {
      return { success: false, error: "Activity not found." };
    }
    revalidateLeadDetail(leadId);
    return { success: true, data: activity };
  } catch (error) {
    return {
      success: false,
      error: mapActivityActionError(error, "Unable to update activity."),
    };
  }
}

export async function deleteLeadActivityAction(
  leadId: string,
  activityId: string
): Promise<ActionResult<{ id: string }>> {
  if (!isValidLeadId(leadId) || !isValidActivityId(activityId)) {
    return { success: false, error: "Invalid activity." };
  }

  try {
    const supabase = await createClient();
    await deleteActivityForCurrentUser(supabase, activityId);
    revalidateLeadDetail(leadId);
    return { success: true, data: { id: activityId } };
  } catch (error) {
    return {
      success: false,
      error: mapActivityActionError(error, "Unable to delete activity."),
    };
  }
}
