"use server";

import { revalidatePath } from "next/cache";
import {
  createSenderProfileForCurrentUser,
  getSenderProfileForCurrentUser,
  updateSenderProfileForCurrentUser,
} from "@/lib/sender-profile/repository";
import {
  normalizeSenderProfileInput,
  validateSenderProfileInput,
} from "@/lib/sender-profile/validation";
import type { SenderProfile, SenderProfileInput } from "@/lib/sender-profile-types";
import type { ActionResult } from "@/lib/leads/actions";
import { createClient } from "@/lib/supabase/server";

const PROFILE_PATH = "/dashboard/settings/profile";

function mapProfileActionError(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const message = error.message;
  if (
    message === "Unauthorized" ||
    message === "Sender profile not found." ||
    message === "Sender profile already exists."
  ) {
    return message === "Unauthorized" ? "You must be signed in to continue." : message;
  }

  return fallback;
}

export async function saveSenderProfileAction(
  input: SenderProfileInput
): Promise<ActionResult<SenderProfile>> {
  const validationError = validateSenderProfileInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const normalized = normalizeSenderProfileInput(input);

  try {
    const supabase = await createClient();
    const existing = await getSenderProfileForCurrentUser(supabase);

    const profile = existing
      ? await updateSenderProfileForCurrentUser(supabase, normalized)
      : await createSenderProfileForCurrentUser(supabase, normalized);

    revalidatePath(PROFILE_PATH);
    return { success: true, data: profile };
  } catch (error) {
    return {
      success: false,
      error: mapProfileActionError(error, "Unable to save sender profile."),
    };
  }
}
