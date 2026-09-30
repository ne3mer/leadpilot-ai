"use client";

import { useState } from "react";
import { AiSignalStatus } from "@/components/visual/signal/ai-signal-status";
import { PrioritySignalBeam } from "@/components/visual/signal/priority-signal-beam";
import { SignalEmptyStructure } from "@/components/visual/signal/signal-empty-structure";
import { SignalNodes } from "@/components/visual/signal/signal-nodes";
import { SignalPath } from "@/components/visual/signal/signal-path";
import { SignatureSignalObject } from "@/components/visual/signal/signature-signal-object";
import { typographyClass } from "@/lib/design-system/typography";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

function LabSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0 border-t border-border pt-[var(--lp-space-8)] first:border-t-0 first:pt-0">
      <h2 className={typographyClass("sectionTitle")}>{title}</h2>
      <div className="mt-[var(--lp-space-6)] min-w-0">{children}</div>
    </section>
  );
}

export function SignalVisualLab() {
  const reduced = usePrefersReducedMotion();
  const [nodesConnected, setNodesConnected] = useState(false);
  const [aiActive, setAiActive] = useState(false);

  return (
    <div className="min-w-0 space-y-0">
      <p className={typographyClass("bodySmall", "max-w-prose")}>
        Internal lab for LeadPilot&apos;s Signal visual language. Not linked from product navigation.
        {reduced ? " Reduced motion is active on this device." : null}
      </p>

      <LabSection title="1 · Signal path">
        <div className="flex flex-wrap gap-8">
          <SignalPath strength="strong" animate />
          <SignalPath strength="moderate" animate />
          <SignalPath strength="quiet" animate={false} />
        </div>
      </LabSection>

      <LabSection title="2 · Signal nodes">
        <button
          type="button"
          className="lp-focus-ring mb-4 rounded-sm border border-border px-3 py-2 lp-text-body-small"
          onClick={() => setNodesConnected((v) => !v)}
        >
          Toggle connection reveal
        </button>
        <SignalNodes connected={nodesConnected} />
      </LabSection>

      <LabSection title="3 · Priority signal strength">
        <div className="flex flex-wrap items-center gap-10">
          <div className="flex items-center gap-3">
            <PrioritySignalBeam priority="high" />
            <span className="lp-text-body-small">High</span>
          </div>
          <div className="flex items-center gap-3">
            <PrioritySignalBeam priority="medium" />
            <span className="lp-text-body-small">Medium</span>
          </div>
          <div className="flex items-center gap-3">
            <PrioritySignalBeam priority="low" />
            <span className="lp-text-body-small">Low</span>
          </div>
        </div>
      </LabSection>

      <LabSection title="4 · AI generation state">
        <button
          type="button"
          className="lp-focus-ring mb-4 rounded-sm border border-border px-3 py-2 lp-text-body-small"
          onClick={() => setAiActive((v) => !v)}
        >
          Toggle AI signal
        </button>
        <AiSignalStatus active={aiActive} />
      </LabSection>

      <LabSection title="5 · Signature visual (composed)">
        <DashboardSignalArtPreview />
      </LabSection>

      <LabSection title="6 · Signature 3D object">
        <div className="flex flex-wrap gap-12">
          <div>
            <p className="lp-text-caption text-muted mb-2">Full</p>
            <SignatureSignalObject density="full" />
          </div>
          <div>
            <p className="lp-text-caption text-muted mb-2">Reduced (tablet/mobile)</p>
            <SignatureSignalObject density="reduced" />
          </div>
          <div>
            <p className="lp-text-caption text-muted mb-2">Static fallback</p>
            <SignatureSignalObject density="static" />
          </div>
        </div>
      </LabSection>

      <LabSection title="7 · Motion examples">
        <p className={typographyClass("bodySmall", "mb-4 max-w-prose")}>
          Editorial entrance uses{" "}
          <code className="text-primary">lp-motion-editorial-enter</code> (stagger children with{" "}
          <code className="text-primary">style=&#123;&#123; animationDelay &#125;&#125;</code>).
        </p>
        <div className="lp-motion-editorial-enter space-y-2">
          <p className="lp-text-subsection" style={{ animationDelay: "0ms" }}>
            Signal
          </p>
          <p className="lp-text-body-small" style={{ animationDelay: "60ms" }}>
            Connection
          </p>
          <p className="lp-text-body-small" style={{ animationDelay: "120ms" }}>
            Direction
          </p>
        </div>
      </LabSection>

      <LabSection title="8 · Empty state structure">
        <div className="flex items-center gap-4 rounded-sm border border-border bg-surface-subtle px-6 py-8">
          <SignalEmptyStructure />
          <div>
            <p className="lp-text-subsection">Nothing here yet</p>
            <p className="lp-text-body-small mt-1">Waiting for the first lead signal.</p>
          </div>
        </div>
      </LabSection>
    </div>
  );
}

function DashboardSignalArtPreview() {
  return (
    <div className="relative h-32 max-w-md rounded-sm border border-border bg-surface-subtle">
      <div className="absolute inset-0 flex items-center justify-end p-4">
        <SignatureSignalObject density="full" className="scale-75" />
      </div>
      <div className="absolute bottom-4 left-4">
        <SignalPath variant="compact" strength="moderate" animate />
      </div>
    </div>
  );
}
