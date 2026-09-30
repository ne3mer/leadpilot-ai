/**
 * Phase 11B dashboard priority integration checks (logic only).
 * Run: npx tsx scripts/priority-dashboard-checks.mts
 *
 * Browser checks (F, J, K) are documented below — not executed here.
 */
import type { Lead } from "../lib/lead-types";
import {
  buildDashboardPriorityLeads,
  DASHBOARD_PRIORITY_LEADS_LIMIT,
  groupActivitiesByLeadId,
} from "../lib/leads/priority-dashboard";

const AS_OF = new Date("2026-06-15T12:00:00Z");

function daysAgo(days: number): string {
  return new Date(AS_OF.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

function lead(partial: Partial<Lead> & Pick<Lead, "id" | "status">): Lead {
  return {
    name: partial.name ?? "Lead",
    company: partial.company ?? "Co",
    email: partial.email ?? "a@b.co",
    user_id: "user-1",
    created_at: partial.created_at ?? daysAgo(30),
    updated_at: partial.updated_at ?? daysAgo(1),
    ...partial,
  };
}

function assert(label: string, condition: boolean, detail = "") {
  if (!condition) {
    console.error(`FAIL ${label}${detail ? `: ${detail}` : ""}`);
    process.exitCode = 1;
  } else {
    console.log(`OK ${label}`);
  }
}

const activities = groupActivitiesByLeadId([
  {
    id: "a1",
    lead_id: "qualified-pricing",
    user_id: "user-1",
    type: "email",
    content: "Asked about pricing",
    created_at: daysAgo(1),
  },
  {
    id: "a2",
    lead_id: "contacted-recent",
    user_id: "user-1",
    type: "call",
    content: "Check-in call",
    created_at: daysAgo(2),
  },
]);

const leads: Lead[] = [
  lead({ id: "new-active", status: "New", name: "New Lead", updated_at: daysAgo(0) }),
  lead({ id: "won-terminal", status: "Won", name: "Won Lead" }),
  lead({ id: "lost-terminal", status: "Lost", name: "Lost Lead" }),
  lead({
    id: "qualified-pricing",
    status: "Qualified",
    name: "Pricing Lead",
    updated_at: daysAgo(1),
  }),
  lead({
    id: "contacted-recent",
    status: "Contacted",
    name: "Contacted Lead",
    updated_at: daysAgo(2),
  }),
];

const top = buildDashboardPriorityLeads(leads, activities, { asOf: AS_OF });

assert("A new active lead included", top.some((item) => item.id === "new-active"));
assert("B won excluded", !top.some((item) => item.id === "won-terminal"));
assert("C lost excluded", !top.some((item) => item.id === "lost-terminal"));

const pricingIndex = top.findIndex((item) => item.id === "qualified-pricing");
const newIndex = top.findIndex((item) => item.id === "new-active");
assert(
  "D qualified pricing ranks above new",
  pricingIndex !== -1 && newIndex !== -1 && pricingIndex < newIndex,
  `pricing=${pricingIndex} new=${newIndex}`
);

assert(
  "D pricing reason from engine",
  top[pricingIndex]?.displayReasons.some((r) => r.toLowerCase().includes("pricing")) ?? false
);

const newerNegative = buildDashboardPriorityLeads(
  [
    lead({
      id: "flip",
      status: "Qualified",
      name: "Flip",
      updated_at: daysAgo(0),
    }),
  ],
  groupActivitiesByLeadId([
    {
      id: "n1",
      lead_id: "flip",
      user_id: "u",
      type: "note",
      content: "Not interested at this time.",
      created_at: daysAgo(1),
    },
    {
      id: "n2",
      lead_id: "flip",
      user_id: "u",
      type: "note",
      content: "Interested in pricing",
      created_at: daysAgo(10),
    },
  ]),
  { asOf: AS_OF }
);
assert(
  "E newer negative reflected",
  newerNegative[0]?.displayReasons.some((r) => r.includes("reduced interest")) ?? false
);

const manyLeads = Array.from({ length: 8 }, (_, index) =>
  lead({
    id: `lead-${index}`,
    status: "New",
    name: `Lead ${index}`,
    updated_at: daysAgo(index),
  })
);
const limited = buildDashboardPriorityLeads(manyLeads, new Map(), {
  asOf: AS_OF,
  limit: DASHBOARD_PRIORITY_LEADS_LIMIT,
});
assert("G limit respected", limited.length === DASHBOARD_PRIORITY_LEADS_LIMIT);

const empty = buildDashboardPriorityLeads(
  [lead({ id: "won-only", status: "Won" })],
  new Map(),
  { asOf: AS_OF }
);
assert("H empty when only terminal", empty.length === 0);

const tieA = lead({
  id: "aaa",
  status: "Contacted",
  updated_at: daysAgo(5),
});
const tieB = lead({
  id: "bbb",
  status: "Contacted",
  updated_at: daysAgo(1),
});
const tied = buildDashboardPriorityLeads([tieA, tieB], new Map(), { asOf: AS_OF });
assert(
  "I tie-break updated_at",
  tied[0]?.id === "bbb" && tied[1]?.id === "aaa",
  JSON.stringify(tied.map((t) => t.id))
);

if (process.exitCode !== 1) {
  console.log("All priority-dashboard logic checks passed.");
  console.log("");
  console.log("Manual browser verification still required:");
  console.log("F — Priority link opens /dashboard/leads/[id]");
  console.log("J — No horizontal overflow on mobile");
  console.log("K — Cross-user isolation (RLS; second account)");
}
