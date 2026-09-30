import {
  isSenderProfileTonePreference,
  type SenderProfileInput,
  type SenderProfileTonePreference,
} from "@/lib/sender-profile-types";

const LIMITS = {
  full_name: { min: 1, max: 100 },
  job_title: { max: 100 },
  company_name: { min: 1, max: 150 },
  company_description: { max: 1000 },
  services: { max: 1000 },
  target_customers: { max: 500 },
  value_proposition: { max: 1000 },
  website: { max: 300 },
} as const;

function optionalTrimmed(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isValidWebsite(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return true;
  }
  if (trimmed.length > LIMITS.website.max) {
    return false;
  }
  if (/\s/.test(trimmed)) {
    return false;
  }
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    return Boolean(url.hostname.includes("."));
  } catch {
    return false;
  }
}

export function normalizeSenderProfileInput(raw: SenderProfileInput): {
  full_name: string;
  job_title: string | null;
  company_name: string;
  company_description: string | null;
  services: string | null;
  target_customers: string | null;
  value_proposition: string | null;
  tone_preference: SenderProfileTonePreference;
  website: string | null;
} {
  return {
    full_name: raw.full_name.trim(),
    job_title: optionalTrimmed(raw.job_title),
    company_name: raw.company_name.trim(),
    company_description: optionalTrimmed(raw.company_description),
    services: optionalTrimmed(raw.services),
    target_customers: optionalTrimmed(raw.target_customers),
    value_proposition: optionalTrimmed(raw.value_proposition),
    tone_preference: raw.tone_preference,
    website: optionalTrimmed(raw.website),
  };
}

export function validateSenderProfileInput(input: SenderProfileInput): string | null {
  const normalized = normalizeSenderProfileInput(input);

  if (
    normalized.full_name.length < LIMITS.full_name.min ||
    normalized.full_name.length > LIMITS.full_name.max
  ) {
    return "Enter a valid full name (1–100 characters).";
  }

  if (normalized.job_title && normalized.job_title.length > LIMITS.job_title.max) {
    return "Job title is too long.";
  }

  if (
    normalized.company_name.length < LIMITS.company_name.min ||
    normalized.company_name.length > LIMITS.company_name.max
  ) {
    return "Enter a valid company name (1–150 characters).";
  }

  if (
    normalized.company_description &&
    normalized.company_description.length > LIMITS.company_description.max
  ) {
    return "Company description is too long.";
  }

  if (normalized.services && normalized.services.length > LIMITS.services.max) {
    return "Services field is too long.";
  }

  if (
    normalized.target_customers &&
    normalized.target_customers.length > LIMITS.target_customers.max
  ) {
    return "Target customers field is too long.";
  }

  if (
    normalized.value_proposition &&
    normalized.value_proposition.length > LIMITS.value_proposition.max
  ) {
    return "Value proposition is too long.";
  }

  if (!isSenderProfileTonePreference(normalized.tone_preference)) {
    return "Select a valid preferred tone.";
  }

  if (normalized.website && !isValidWebsite(normalized.website)) {
    return "Enter a valid website URL.";
  }

  return null;
}
