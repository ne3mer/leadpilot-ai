"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { leadStatuses, type Lead, type LeadStatus } from "@/lib/lead-types";

type Tone = "Friendly" | "Professional" | "Direct";
type Goal = "Book a call" | "Send pricing" | "Follow up after demo";

type MessageTemplate = {
  opener: Record<Tone, string>;
  context: (company: string, status: LeadStatus) => string;
  goalLine: Record<Goal, Record<Tone, string>>;
  closer: Record<Tone, string>;
};

const templates: MessageTemplate[] = [
  {
    opener: {
      Friendly: "Hey {name},",
      Professional: "Hi {name},",
      Direct: "{name},",
    },
    context: (company, status) =>
      `following your ${status.toLowerCase()} stage at ${company}, I wanted to share a quick next step to keep momentum high.`,
    goalLine: {
      "Book a call": {
        Friendly:
          "Would you be open to a quick 15-minute call this week to map the best rollout for your team?",
        Professional:
          "Would you be available for a 15-minute call this week to align on your implementation plan?",
        Direct: "Let us lock a 15-minute call this week to finalize your next steps.",
      },
      "Send pricing": {
        Friendly:
          "I can send a simple pricing breakdown tailored to your current lead volume if that helps.",
        Professional:
          "I can share a tailored pricing overview based on your current pipeline requirements.",
        Direct: "I will send the pricing breakdown today so your team can review immediately.",
      },
      "Follow up after demo": {
        Friendly:
          "How did the demo feel from your side, and is there anything you want us to customize further?",
        Professional:
          "I would value your feedback on the demo and can provide a customized follow-up walkthrough.",
        Direct:
          "Please confirm your demo feedback so we can move directly to rollout planning.",
      },
    },
    closer: {
      Friendly: "Happy to make this easy for you.",
      Professional: "Looking forward to your thoughts.",
      Direct: "Reply with your decision and we will proceed.",
    },
  },
  {
    opener: {
      Friendly: "Hi {name},",
      Professional: "Hello {name},",
      Direct: "Hi {name},",
    },
    context: (company, status) =>
      `based on your current ${status.toLowerCase()} progress at ${company}, there is a clear opportunity to speed up conversion this week.`,
    goalLine: {
      "Book a call": {
        Friendly: "Want to pick a quick slot and map the fastest path to launch?",
        Professional:
          "I suggest a short call to align stakeholders and define your launch timeline.",
        Direct: "Choose a call slot and we can close the plan today.",
      },
      "Send pricing": {
        Friendly: "I can send you a transparent pricing summary right away.",
        Professional:
          "I can share a clear pricing summary with package recommendations for your use case.",
        Direct: "I will share pricing now so procurement can review today.",
      },
      "Follow up after demo": {
        Friendly: "Just checking in after the demo - should we move to the next step?",
        Professional:
          "Following the demo, I can provide a concise recap and proposed implementation next steps.",
        Direct: "After the demo, confirm go/no-go so we can proceed accordingly.",
      },
    },
    closer: {
      Friendly: "Thanks again, excited to help your team grow.",
      Professional: "Thank you for your time.",
      Direct: "Awaiting your response.",
    },
  },
];

type DashboardAiMessagePanelProps = {
  selectedLead?: Lead | null;
};

export function DashboardAiMessagePanel({ selectedLead }: DashboardAiMessagePanelProps) {
  const [leadName, setLeadName] = useState(selectedLead?.name ?? "Sophia Martinez");
  const [company, setCompany] = useState(selectedLead?.company ?? "Northstar.io");
  const [status, setStatus] = useState<LeadStatus>(selectedLead?.status ?? "Qualified");
  const [tone, setTone] = useState<Tone>("Professional");
  const [goal, setGoal] = useState<Goal>("Book a call");
  const [templateIndex, setTemplateIndex] = useState(0);
  const [copyState, setCopyState] = useState<"idle" | "success">("idle");

  const message = useMemo(() => {
    const template = templates[templateIndex];
    const name = leadName.trim() || "there";
    const companyName = company.trim() || "your company";

    const opener = template.opener[tone].replace("{name}", name);
    const context = template.context(companyName, status);
    const goalText = template.goalLine[goal][tone];
    const closer = template.closer[tone];

    return `${opener} ${context} ${goalText} ${closer}`;
  }, [company, goal, leadName, status, templateIndex, tone]);

  async function handleCopyToClipboard() {
    await navigator.clipboard.writeText(message);
    setCopyState("success");
    window.setTimeout(() => setCopyState("idle"), 1800);
  }

  function handleGenerateMessage() {
    setTemplateIndex((prev) => (prev + 1) % templates.length);
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-emerald-700" />
        <h2 className="text-lg font-medium text-black">AI Message Generator</h2>
      </div>

      {selectedLead ? (
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
          Lead loaded from table: {selectedLead.name} - {selectedLead.company}
        </p>
      ) : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-slate-700">
          Lead Name
          <input
            value={leadName}
            onChange={(event) => setLeadName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring"
            placeholder="e.g. Sophia Martinez"
          />
        </label>

        <label className="text-sm text-slate-700">
          Company
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring"
            placeholder="e.g. Northstar.io"
          />
        </label>

        <label className="text-sm text-slate-700">
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as LeadStatus)}
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring"
          >
            {leadStatuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-700">
          Tone
          <select
            value={tone}
            onChange={(event) => setTone(event.target.value as Tone)}
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring"
          >
            <option>Friendly</option>
            <option>Professional</option>
            <option>Direct</option>
          </select>
        </label>

        <label className="text-sm text-slate-700 sm:col-span-2">
          Goal
          <select
            value={goal}
            onChange={(event) => setGoal(event.target.value as Goal)}
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring"
          >
            <option>Book a call</option>
            <option>Send pricing</option>
            <option>Follow up after demo</option>
          </select>
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-black/10 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        {message}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleGenerateMessage}
          className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:bg-emerald-700"
        >
          Generate Another Version
        </button>

        <button
          type="button"
          onClick={handleCopyToClipboard}
          className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
        >
          <Copy className="h-4 w-4" />
          Copy
        </button>

        {copyState === "success" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            <Check className="h-3.5 w-3.5" />
            Copied to clipboard
          </span>
        ) : null}
      </div>
    </Card>
  );
}
