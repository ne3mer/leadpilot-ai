type AiSignalStatusProps = {
  active?: boolean;
  label?: string;
  className?: string;
};

/** Restrained AI activity indicator — same Signal language as product UI. */
export function AiSignalStatus({
  active = false,
  label = "Interpreting signal",
  className = "",
}: AiSignalStatusProps) {
  return (
    <span
      className={`lp-ai-signal-status ${active ? "lp-ai-signal-status--active" : ""} ${className}`.trim()}
      role={active ? "status" : undefined}
      aria-live={active ? "polite" : undefined}
      aria-label={active ? label : undefined}
    >
      <span className="lp-ai-signal-status__line" aria-hidden />
      <span className="lp-ai-signal-status__dot" aria-hidden />
      {active ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
