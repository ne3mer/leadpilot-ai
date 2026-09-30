import type { LeadPriorityLevel } from "@/lib/leads/priority-types";
import { priorityToSignalStrength, signalStrengthClass } from "@/lib/design-system/signal";

type PrioritySignalBeamProps = {
  priority: LeadPriorityLevel;
  className?: string;
};

/** Vertical beam reinforcing priority level — text remains primary. */
export function PrioritySignalBeam({ priority, className = "" }: PrioritySignalBeamProps) {
  const strength = priorityToSignalStrength[priority];

  return (
    <span
      className={`lp-priority-beam ${signalStrengthClass[strength]} ${className}`.trim()}
      aria-hidden
    >
      <span className="lp-priority-beam__track" />
      <span className="lp-priority-beam__pulse" />
    </span>
  );
}
