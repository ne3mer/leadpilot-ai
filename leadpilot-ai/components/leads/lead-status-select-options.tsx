import {
  activePipelineStatuses,
  terminalLeadStatuses,
  type LeadStatus,
} from "@/lib/lead-types";

type LeadStatusSelectOptionsProps = {
  idPrefix?: string;
};

export function LeadStatusSelectOptions({ idPrefix = "status" }: LeadStatusSelectOptionsProps) {
  return (
    <>
      <optgroup label="Pipeline">
        {activePipelineStatuses.map((item) => (
          <option key={`${idPrefix}-pipeline-${item}`} value={item}>
            {item}
          </option>
        ))}
      </optgroup>
      <optgroup label="Outcome">
        {terminalLeadStatuses.map((item) => (
          <option key={`${idPrefix}-terminal-${item}`} value={item}>
            {item}
          </option>
        ))}
      </optgroup>
    </>
  );
}

export function leadStatusSelectClassName(status: LeadStatus) {
  const classes: Record<LeadStatus, string> = {
    New: "lp-status-new",
    Contacted: "lp-status-contacted",
    Qualified: "lp-status-qualified",
    "Proposal Sent": "lp-status-proposal",
    Negotiation: "lp-status-negotiation",
    Won: "lp-status-won",
    Lost: "lp-status-lost",
  };

  return classes[status];
}

/** Text color only — for quiet pipeline metadata controls */
export function leadStatusMetadataClassName(status: LeadStatus) {
  const classes: Record<LeadStatus, string> = {
    New: "text-[var(--lp-status-new-fg)]",
    Contacted: "text-[var(--lp-status-contacted-fg)]",
    Qualified: "text-[var(--lp-status-qualified-fg)]",
    "Proposal Sent": "text-[var(--lp-status-proposal-fg)]",
    Negotiation: "text-[var(--lp-status-negotiation-fg)]",
    Won: "text-[var(--lp-status-won-fg)]",
    Lost: "text-[var(--lp-status-lost-fg)]",
  };

  return classes[status];
}

export function leadStatusQuietSelectClassName(status: LeadStatus) {
  return `border-border bg-surface font-normal ${leadStatusMetadataClassName(status)}`;
}
