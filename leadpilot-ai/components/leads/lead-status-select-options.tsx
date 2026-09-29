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
    New: "bg-zinc-100 text-zinc-700",
    Contacted: "bg-lime-100 text-lime-800",
    Qualified: "bg-emerald-100 text-emerald-800",
    "Proposal Sent": "bg-slate-100 text-slate-700",
    Negotiation: "bg-amber-100 text-amber-800",
    Won: "bg-emerald-200 text-emerald-900",
    Lost: "bg-red-100 text-red-800",
  };

  return classes[status];
}
