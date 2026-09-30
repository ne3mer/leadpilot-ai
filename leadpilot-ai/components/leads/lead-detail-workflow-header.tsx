type LeadDetailWorkflowHeaderProps = {
  step: string;
  title: string;
  description: string;
};

export function LeadDetailWorkflowHeader({
  step,
  title,
  description,
}: LeadDetailWorkflowHeaderProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
        {step}
      </p>
      <h2 className="mt-1 text-lg font-semibold tracking-tight text-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
