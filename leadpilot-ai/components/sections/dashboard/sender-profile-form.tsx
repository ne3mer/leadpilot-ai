"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowLeft } from "lucide-react";
import { saveSenderProfileAction } from "@/lib/sender-profile/actions";
import {
  senderProfileToneLabels,
  senderProfileTonePreferences,
  type SenderProfile,
  type SenderProfileInput,
  type SenderProfileTonePreference,
} from "@/lib/sender-profile-types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type SenderProfileFormProps = {
  initialProfile: SenderProfile | null;
};

const emptyForm: SenderProfileInput = {
  full_name: "",
  job_title: "",
  company_name: "",
  company_description: "",
  services: "",
  target_customers: "",
  value_proposition: "",
  tone_preference: "professional",
  website: "",
};

function profileToForm(profile: SenderProfile): SenderProfileInput {
  return {
    full_name: profile.full_name,
    job_title: profile.job_title ?? "",
    company_name: profile.company_name,
    company_description: profile.company_description ?? "",
    services: profile.services ?? "",
    target_customers: profile.target_customers ?? "",
    value_proposition: profile.value_proposition ?? "",
    tone_preference: profile.tone_preference,
    website: profile.website ?? "",
  };
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring disabled:opacity-60";

export function SenderProfileForm({ initialProfile }: SenderProfileFormProps) {
  const [form, setForm] = useState<SenderProfileInput>(() =>
    initialProfile ? profileToForm(initialProfile) : emptyForm
  );
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const result = await saveSenderProfileAction(form);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setForm(profileToForm(result.data));
      setSuccessMessage("Profile saved.");
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to Dashboard
      </Link>

      <Card className="p-6 sm:p-8">
        <h1 className="text-2xl font-semibold text-black">Profile</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Tell LeadPilot who you are and how you want AI to represent your business.
        </p>

        {successMessage ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            {successMessage}
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-700">
            Full name
            <input
              required
              value={form.full_name}
              disabled={isPending}
              onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))}
              className={inputClassName}
              placeholder="Nima Afsharfar"
            />
          </label>

          <label className="block text-sm text-slate-700">
            Job title
            <input
              value={form.job_title}
              disabled={isPending}
              onChange={(event) => setForm((prev) => ({ ...prev, job_title: event.target.value }))}
              className={inputClassName}
              placeholder="Founder & Full-Stack Developer"
            />
          </label>

          <label className="block text-sm text-slate-700">
            Company name
            <input
              required
              value={form.company_name}
              disabled={isPending}
              onChange={(event) => setForm((prev) => ({ ...prev, company_name: event.target.value }))}
              className={inputClassName}
              placeholder="Nima Studio"
            />
          </label>

          <label className="block text-sm text-slate-700">
            Company description
            <textarea
              rows={3}
              value={form.company_description}
              disabled={isPending}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, company_description: event.target.value }))
              }
              className={`${inputClassName} resize-y`}
              placeholder="Short description of the business."
            />
          </label>

          <label className="block text-sm text-slate-700">
            Services
            <textarea
              rows={3}
              value={form.services}
              disabled={isPending}
              onChange={(event) => setForm((prev) => ({ ...prev, services: event.target.value }))}
              className={`${inputClassName} resize-y`}
              placeholder="Next.js, React, Node.js, Python/Django, AI web applications"
            />
          </label>

          <label className="block text-sm text-slate-700">
            Target customers
            <textarea
              rows={2}
              value={form.target_customers}
              disabled={isPending}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, target_customers: event.target.value }))
              }
              className={`${inputClassName} resize-y`}
              placeholder="Startups and growing businesses"
            />
          </label>

          <label className="block text-sm text-slate-700">
            Value proposition
            <textarea
              rows={3}
              value={form.value_proposition}
              disabled={isPending}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, value_proposition: event.target.value }))
              }
              className={`${inputClassName} resize-y`}
              placeholder="Build and improve production-ready web applications."
            />
          </label>

          <label className="block text-sm text-slate-700">
            Preferred tone
            <select
              value={form.tone_preference}
              disabled={isPending}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  tone_preference: event.target.value as SenderProfileTonePreference,
                }))
              }
              className={inputClassName}
            >
              {senderProfileTonePreferences.map((tone) => (
                <option key={tone} value={tone}>
                  {senderProfileToneLabels[tone]}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-slate-700">
            Website
            <input
              type="text"
              inputMode="url"
              value={form.website}
              disabled={isPending}
              onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
              className={inputClassName}
              placeholder="https://example.com"
            />
          </label>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl px-5 py-2.5 text-sm disabled:opacity-60"
            >
              {isPending ? "Saving…" : "Save profile"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
