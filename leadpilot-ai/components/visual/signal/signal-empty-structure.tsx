type SignalEmptyStructureProps = {
  className?: string;
};

/** Quiet “no signal yet” structure for empty states. */
export function SignalEmptyStructure({ className = "" }: SignalEmptyStructureProps) {
  return (
    <svg
      viewBox="0 0 80 56"
      width={80}
      height={56}
      className={`lp-signal-empty ${className}`.trim()}
      aria-hidden
      role="presentation"
    >
      <circle cx="16" cy="40" r="4" className="lp-signal-empty__node" />
      <circle cx="64" cy="16" r="4" className="lp-signal-empty__node lp-signal-empty__node--dim" />
      <path
        d="M 16 40 Q 40 40 40 28 T 64 16"
        fill="none"
        className="lp-signal-empty__path"
        strokeDasharray="4 6"
      />
    </svg>
  );
}
