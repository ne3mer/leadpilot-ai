import type { Lead } from "@/lib/lead-types";

export type LeadPerformanceTrendPoint = {
  month: string;
  leads: number;
  won: number;
};

function utcMonthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function utcMonthLabel(year: number, monthIndex: number) {
  const date = new Date(Date.UTC(year, monthIndex, 1));
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  });
}

/**
 * Last six UTC calendar months (including current), zero-filled when empty.
 * Each lead is bucketed by `created_at` (UTC).
 * `won` = leads in that month whose current status is Won (not historical progression).
 */
export function computeLeadPerformanceTrend(
  leads: Lead[],
  now: Date = new Date()
): LeadPerformanceTrendPoint[] {
  const bucketDefs: Array<{ key: string; month: string }> = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    const bucketDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
    bucketDefs.push({
      key: utcMonthKey(bucketDate),
      month: utcMonthLabel(bucketDate.getUTCFullYear(), bucketDate.getUTCMonth()),
    });
  }

  const counts = new Map<string, { leads: number; won: number }>();
  for (const bucket of bucketDefs) {
    counts.set(bucket.key, { leads: 0, won: 0 });
  }

  for (const lead of leads) {
    const createdAt = new Date(lead.created_at);
    if (Number.isNaN(createdAt.getTime())) {
      continue;
    }

    const key = utcMonthKey(createdAt);
    const bucket = counts.get(key);
    if (!bucket) {
      continue;
    }

    bucket.leads += 1;
    if (lead.status === "Won") {
      bucket.won += 1;
    }
  }

  return bucketDefs.map((bucket) => {
    const value = counts.get(bucket.key)!;
    return {
      month: bucket.month,
      leads: value.leads,
      won: value.won,
    };
  });
}
