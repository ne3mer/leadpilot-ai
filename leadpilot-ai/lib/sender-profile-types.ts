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

/** Sanitized sender context for server-side AI (no ids or timestamps). */
export type SenderProfileForAI = {
  full_name: string;
  job_title: string | null;
  company_name: string;
  company_description: string | null;
  services: string | null;
  target_customers: string | null;
  value_proposition: string | null;
  tone_preference: SenderProfileTonePreference;
  website: string | null;
};

export function toSenderProfileForAI(profile: SenderProfile): SenderProfileForAI {
  return {
    full_name: profile.full_name,
    job_title: profile.job_title,
    company_name: profile.company_name,
    company_description: profile.company_description,
    services: profile.services,
    target_customers: profile.target_customers,
    value_proposition: profile.value_proposition,
    tone_preference: profile.tone_preference,
    website: profile.website,
  };
}
