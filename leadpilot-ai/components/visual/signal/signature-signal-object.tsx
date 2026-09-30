"use client";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type SignatureSignalObjectProps = {
  /** dashboard | lab | empty — scales complexity */
  density?: "full" | "reduced" | "static";
  className?: string;
};

/**
 * LeadPilot signature artifact: layered lamellae suggesting signal → direction.
 * CSS 3D only — no WebGL.
 */
export function SignatureSignalObject({
  density = "full",
  className = "",
}: SignatureSignalObjectProps) {
  const reducedMotion = usePrefersReducedMotion();
  const animate = density === "full" && !reducedMotion;
  const showLayers = density !== "static";

  return (
    <div
      className={`lp-signature-object ${animate ? "lp-signature-object--animate" : ""} ${className}`.trim()}
      aria-hidden
      role="presentation"
    >
      <div className="lp-signature-object__stage">
        <div className="lp-signature-object__lamella lp-signature-object__lamella--base" />
        {showLayers ? (
          <>
            <div className="lp-signature-object__lamella lp-signature-object__lamella--mid" />
            <div className="lp-signature-object__lamella lp-signature-object__lamella--accent" />
            <div className="lp-signature-object__beam" />
          </>
        ) : (
          <div className="lp-signature-object__lamella lp-signature-object__lamella--accent" />
        )}
      </div>
    </div>
  );
}
