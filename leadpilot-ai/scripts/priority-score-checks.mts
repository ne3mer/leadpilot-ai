/**
 * Phase 11A manual test cases (no test framework).
 * Run: npx tsx scripts/priority-score-checks.mts
 */
import {
  computeLeadPriorityScore,
  LEAD_PRIORITY_THRESHOLDS,
} from "../lib/leads/priority-score";

const AS_OF = new Date("2026-06-15T12:00:00Z");

function daysAgo(days: number): string {
  return new Date(AS_OF.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

function assert(label: string, condition: boolean, detail: string) {
  if (!condition) {
    console.error(`FAIL ${label}: ${detail}`);
    process.exitCode = 1;
  } else {
    console.log(`OK ${label}`);
  }
}

const baseLead = {
  created_at: daysAgo(30),
  updated_at: daysAgo(30),
};

// A. New lead with no activity
const a = computeLeadPriorityScore(
  { ...baseLead, status: "New" },
  [],
  { asOf: AS_OF }
);
assert("A low priority", a.priority === "low", JSON.stringify(a));
assert("A no activity reason", a.reasons.some((r) => r.includes("No recorded activity")), "");

// B. Contacted + recent activity
const b = computeLeadPriorityScore(
  { ...baseLead, status: "Contacted" },
  [{ type: "call", content: "Left voicemail", created_at: daysAgo(2) }],
  { asOf: AS_OF }
);
assert("B medium+", b.score >= LEAD_PRIORITY_THRESHOLDS.mediumMin, JSON.stringify(b));

// C. Qualified + recent pricing interest
const c = computeLeadPriorityScore(
  { ...baseLead, status: "Qualified" },
  [{ type: "email", content: "Asked about pricing options", created_at: daysAgo(1) }],
  { asOf: AS_OF }
);
assert("C high", c.priority === "high", JSON.stringify(c));
assert("C pricing reason", c.reasons.includes("Recent pricing interest"), "");

// D. Qualified + old activity
const d = computeLeadPriorityScore(
  { ...baseLead, status: "Qualified" },
  [{ type: "note", content: "Interested", created_at: daysAgo(120) }],
  { asOf: AS_OF }
);
assert("D no recent activity", d.reasons.includes("No recent activity"), JSON.stringify(d));
assert("D below high", d.score < LEAD_PRIORITY_THRESHOLDS.highMin, "");

// E. newer negative overrides older positive
const e = computeLeadPriorityScore(
  { ...baseLead, status: "Qualified" },
  [
    { type: "note", content: "Not interested at this time.", created_at: daysAgo(1) },
    { type: "note", content: "Interested in discussing pricing.", created_at: daysAgo(20) },
  ],
  { asOf: AS_OF }
);
assert("E reduced interest", e.reasons.includes("Latest activity indicates reduced interest"), JSON.stringify(e));
assert("E below C", e.score < c.score, `${e.score} vs ${c.score}`);

// F. Won
const f = computeLeadPriorityScore(
  { ...baseLead, status: "Won" },
  [{ type: "note", content: "Interested in pricing", created_at: daysAgo(1) }],
  { asOf: AS_OF }
);
assert("F low terminal", f.priority === "low", JSON.stringify(f));
assert("F ignores activity boost", f.score <= 15, String(f.score));

// G. Lost
const g = computeLeadPriorityScore(
  { ...baseLead, status: "Lost" },
  [],
  { asOf: AS_OF }
);
assert("G low", g.priority === "low", JSON.stringify(g));

// H. repeated identical activities
const one = computeLeadPriorityScore(
  { ...baseLead, status: "Contacted" },
  [{ type: "note", content: "Very interested", created_at: daysAgo(2) }],
  { asOf: AS_OF }
);
const many = computeLeadPriorityScore(
  { ...baseLead, status: "Contacted" },
  Array.from({ length: 5 }, () => ({
    type: "note" as const,
    content: "Very interested",
    created_at: daysAgo(2),
  })),
  { asOf: AS_OF }
);
assert("H no inflation", one.score === many.score, `${one.score} vs ${many.score}`);

// I. score bounds
const i = computeLeadPriorityScore(
  { ...baseLead, status: "Negotiation" },
  [
    { type: "call", content: "Budget approved, pricing quote ready, interested", created_at: daysAgo(0) },
  ],
  { asOf: AS_OF }
);
assert("I in range", i.score >= 0 && i.score <= 100, String(i.score));

if (process.exitCode !== 1) {
  console.log("All priority-score checks passed.");
}
