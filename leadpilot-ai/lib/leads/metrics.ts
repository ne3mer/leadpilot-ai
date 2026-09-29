import { leadStatuses, type Lead } from "@/lib/lead-types";

/**
 * Conversion rate (%) = (Won / Total Leads) × 100, rounded to one decimal.
 * Returns 0 when totalLeads is 0.
 * Pipeline stages (New through Negotiation) are not counted as converted.
 */
export type LeadDashboardMetrics = {
  totalLeads: number;
  new: number;
  contacted: number;
  qualified: number;
  proposalSent: number;
  negotiation: number;
  won: number;
  lost: number;
  conversionRatePercent: number;
};

function emptyStatusCounts(): Record<(typeof leadStatuses)[number], number> {
  return leadStatuses.reduce(
    (acc, status) => {
      acc[status] = 0;
      return acc;
    },
    {} as Record<(typeof leadStatuses)[number], number>
  );
}

export function computeLeadMetrics(leads: Lead[]): LeadDashboardMetrics {
  const byStatus = emptyStatusCounts();

  for (const lead of leads) {
    byStatus[lead.status] += 1;
  }

  const totalLeads = leads.length;
  const won = byStatus.Won;

  const conversionRatePercent =
    totalLeads === 0 ? 0 : Math.round((won / totalLeads) * 1000) / 10;

  return {
    totalLeads,
    new: byStatus.New,
    contacted: byStatus.Contacted,
    qualified: byStatus.Qualified,
    proposalSent: byStatus["Proposal Sent"],
    negotiation: byStatus.Negotiation,
    won,
    lost: byStatus.Lost,
    conversionRatePercent,
  };
}

export function formatConversionRate(percent: number) {
  return `${percent.toFixed(1)}%`;
}
