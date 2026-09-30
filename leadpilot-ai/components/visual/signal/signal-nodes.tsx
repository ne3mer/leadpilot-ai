type SignalNodesProps = {
  connected?: boolean;
  className?: string;
};

/** Two nodes with optional connection reveal. */
export function SignalNodes({ connected = false, className = "" }: SignalNodesProps) {
  return (
    <svg
      viewBox="0 0 160 48"
      width={160}
      height={48}
      className={`lp-signal-nodes ${connected ? "lp-signal-nodes--connected" : ""} ${className}`.trim()}
      aria-hidden
      role="presentation"
    >
      <line x1="28" y1="24" x2="132" y2="24" className="lp-signal-nodes__connector" />
      <circle cx="28" cy="24" r="6" className="lp-signal-nodes__node" />
      <circle cx="132" cy="24" r="6" className="lp-signal-nodes__node lp-signal-nodes__node--target" />
    </svg>
  );
}
