type AiGeneratedLabelProps = {
  variant?: "default" | "draft";
  className?: string;
};

export function AiGeneratedLabel({
  variant = "default",
  className = "",
}: AiGeneratedLabelProps) {
  const text = variant === "draft" ? "AI-generated draft" : "AI-generated";

  return (
    <span
      className={`inline-flex rounded-md border border-violet-200/80 bg-violet-50/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-800 ${className}`.trim()}
      role="note"
    >
      {text}
    </span>
  );
}
