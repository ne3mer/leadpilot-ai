"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

const templates = [
  "Hi {{name}}, we noticed your team is scaling outbound efforts. Want to see how LeadPilot AI can increase your conversion rate by 30% this quarter?",
  "Hey {{name}}, based on your recent activity, I put together a short demo to show how AI follow-ups can accelerate your pipeline. Interested?",
  "Hi {{name}}, we helped teams like yours reduce response time and close deals faster. I can share a personalized workflow if helpful.",
];

export function AIMessageGenerator() {
  const [leadName, setLeadName] = useState("Sophia");
  const [tone, setTone] = useState("Professional");
  const [templateIndex, setTemplateIndex] = useState(0);

  const base = templates[templateIndex];
  let message = base;

  if (tone === "Friendly") {
    message = base
      .replace("Hi", "Hey")
      .replace("Interested?", "Would love to hear what you think!");
  } else if (tone === "Direct") {
    message = base.replace(
      "Want to see how LeadPilot AI can increase your conversion rate by 30% this quarter?",
      "Can we schedule a quick walkthrough this week?"
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-indigo-300" />
        <h2 className="text-lg font-medium text-white">AI Message Generator</h2>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-slate-300">
          Lead Name
          <input
            value={leadName}
            onChange={(event) => setLeadName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-white outline-none ring-indigo-400/40 transition focus:ring"
            placeholder="Enter lead name"
          />
        </label>

        <label className="text-sm text-slate-300">
          Tone
          <select
            value={tone}
            onChange={(event) => setTone(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-white outline-none ring-indigo-400/40 transition focus:ring"
          >
            <option>Professional</option>
            <option>Friendly</option>
            <option>Direct</option>
          </select>
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/80 p-4 text-sm leading-6 text-slate-200">
        {message.replace("{{name}}", leadName || "there")}
      </div>

      <button
        type="button"
        onClick={() =>
          setTemplateIndex((prev) => (prev + 1) % templates.length)
        }
        className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
      >
        Generate Another Message
      </button>
    </section>
  );
}
