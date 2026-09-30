import { LeadDetailSection } from "@/components/leads/lead-detail-section";

type LeadDetailWorkflowHeaderProps = {
  step: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  id?: string;
};

/** Maps legacy `step` (e.g. "1 · Lead") to numbered section headers. */
function stepToIndex(step: string): string {
  const leading = step.split("·")[0]?.trim() ?? step;
  const num = parseInt(leading, 10);
  if (!Number.isNaN(num)) {
    return String(num).padStart(2, "0");
  }
  return leading;
}

export function LeadDetailWorkflowHeader({
  step,
  title,
  description,
  children,
  id,
}: LeadDetailWorkflowHeaderProps) {
  return (
    <LeadDetailSection
      index={stepToIndex(step)}
      title={title}
      description={description}
      id={id}
    >
      {children}
    </LeadDetailSection>
  );
}
