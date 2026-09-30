import {
  aiFollowUpToneLabels,
  aiFollowUpTones,
  type AiFollowUpTone,
} from "@/lib/ai/constants";

/** Must match `public.sender_profiles.tone_preference` check constraint. */
export type SenderProfileTonePreference = AiFollowUpTone;

export const senderProfileTonePreferences = aiFollowUpTones;

export const senderProfileToneLabels = aiFollowUpToneLabels;

export type SenderProfile = {
  id: string;
  user_id: string;
  full_name: string;
  job_title: string | null;
  company_name: string;
  company_description: string | null;
  services: string | null;
  target_customers: string | null;
  value_proposition: string | null;
  tone_preference: SenderProfileTonePreference;
  website: string | null;
  created_at: string;
  updated_at: string;
};

export type SenderProfileInput = {
  full_name: string;
  job_title: string;
  company_name: string;
  company_description: string;
  services: string;
  target_customers: string;
  value_proposition: string;
  tone_preference: SenderProfileTonePreference;
  website: string;
};

export function isSenderProfileTonePreference(
  value: string
): value is SenderProfileTonePreference {
  return (senderProfileTonePreferences as readonly string[]).includes(value);
}
