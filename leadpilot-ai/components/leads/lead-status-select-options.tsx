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
