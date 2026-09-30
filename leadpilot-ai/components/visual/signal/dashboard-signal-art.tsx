"use client";

import dynamic from "next/dynamic";
import { SignalPath } from "@/components/visual/signal/signal-path";

const SignatureSignalObject = dynamic(
  () =>
    import("@/components/visual/signal/signature-signal-object").then(
      (m) => m.SignatureSignalObject
    ),
  {
    loading: () => <DashboardSignalArtFallback />,
  }
);

/** Secondary brand expression beside dashboard greeting — content stays primary. */
export function DashboardSignalArt() {
  return (
    <div
      className="relative hidden min-h-[7rem] w-full max-w-[11rem] shrink-0 sm:block md:max-w-[13rem]"
      aria-hidden
    >
      <div className="absolute inset-0 flex items-end justify-end opacity-90">
        <SignatureSignalObject density="full" className="scale-90 md:scale-100" />
      </div>
      <div className="absolute bottom-2 left-0 hidden opacity-70 md:block">
        <SignalPath strength="moderate" animate variant="compact" />
      </div>
    </div>
  );
}

export function DashboardSignalArtFallback() {
  return (
    <div
      className="hidden h-[7rem] w-[11rem] shrink-0 sm:block md:w-[13rem]"
      aria-hidden
    >
      <div className="flex h-full w-full items-end justify-end">
        <div className="lp-signature-object lp-signature-object--static">
          <div className="lp-signature-object__stage">
            <div className="lp-signature-object__lamella lp-signature-object__lamella--accent" />
          </div>
        </div>
      </div>
    </div>
  );
}
