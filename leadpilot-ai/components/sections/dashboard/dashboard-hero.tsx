"use client";

import dynamic from "next/dynamic";
import { typographyClass } from "@/lib/design-system/typography";
import { DashboardSignalArtFallback } from "@/components/visual/signal/dashboard-signal-art";

const DashboardSignalArt = dynamic(
  () =>
    import("@/components/visual/signal/dashboard-signal-art").then((m) => m.DashboardSignalArt),
  { loading: () => <DashboardSignalArtFallback /> }
);

type DashboardHeroSectionProps = {
  userLabel?: string;
};

function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0]?.trim() ?? "";
  if (!local) {
    return "there";
  }
  const segment = local.split(/[._-]/)[0] ?? local;
  return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
}

export function DashboardPageHeader({ userLabel }: DashboardHeroSectionProps) {
  const name = userLabel ? displayNameFromEmail(userLabel) : "there";

  return (
    <header className="flex min-w-0 flex-col gap-[var(--lp-space-4)] sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 lp-motion-editorial-enter">
        <h1 className={typographyClass("pageTitle")} style={{ animationDelay: "0ms" }}>
          Good morning, {name}
        </h1>
        <p className={typographyClass("bodySmall", "mt-2 max-w-prose")} style={{ animationDelay: "70ms" }}>
          Here&apos;s what needs your attention.
        </p>
      </div>
      <DashboardSignalArt />
    </header>
  );
}

/** @deprecated Use DashboardPageHeader — kept for import compatibility during migration */
export function DashboardHeroSection(props: DashboardHeroSectionProps) {
  return <DashboardPageHeader {...props} />;
}
