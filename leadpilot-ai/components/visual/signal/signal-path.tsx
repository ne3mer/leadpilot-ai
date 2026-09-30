"use client";

import { useEffect, useState } from "react";

type SignalPathProps = {
  /** strong | moderate | quiet — visual weight only */
  strength?: "strong" | "moderate" | "quiet";
  /** Animate pulse along path */
  animate?: boolean;
  className?: string;
  /** compact for inline UI */
  variant?: "default" | "compact";
};

const PULSE_DUR = "2.8s";

/**
 * Abstract trajectory — a curved path with optional traveling pulse.
 * SMIL animation mounts after hydration to avoid server/client attribute mismatches.
 */
export function SignalPath({
  strength = "moderate",
  animate = true,
  className = "",
  variant = "default",
}: SignalPathProps) {
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    if (!animate) {
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      setMotionReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [animate]);

  const height = variant === "compact" ? 32 : 64;
  const width = variant === "compact" ? 120 : 200;
  const pathD = `M 4 ${height * 0.72} C ${width * 0.35} ${height * 0.1}, ${width * 0.65} ${height * 0.95}, ${width - 4} ${height * 0.28}`;
  const dotR = variant === "compact" ? 2.5 : 3.5;
  const showMotion = animate && motionReady;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={`lp-signal-path ${signalStrengthClass(strength)} ${className}`.trim()}
      aria-hidden
      role="presentation"
    >
      <path d={pathD} fill="none" className="lp-signal-path__line" />
      {showMotion ? (
        <circle r={dotR} className="lp-signal-path__pulse">
          <animateMotion dur={PULSE_DUR} repeatCount="1" path={pathD} />
        </circle>
      ) : (
        <circle
          cx={animate ? 4 : width - 4}
          cy={animate ? height * 0.72 : height * 0.28}
          r={dotR}
          className={animate ? "lp-signal-path__pulse" : "lp-signal-path__node"}
        />
      )}
    </svg>
  );
}

function signalStrengthClass(strength: "strong" | "moderate" | "quiet"): string {
  if (strength === "strong") {
    return "lp-signal-strength-strong";
  }
  if (strength === "quiet") {
    return "lp-signal-strength-quiet";
  }
  return "lp-signal-strength-moderate";
}
