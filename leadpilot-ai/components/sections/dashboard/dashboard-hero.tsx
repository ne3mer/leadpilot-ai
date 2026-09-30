import { typographyClass } from "@/lib/design-system/typography";

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
    <header className="min-w-0 pb-[var(--lp-space-2)]">
      <h1 className={typographyClass("pageTitle")}>Good morning, {name}</h1>
      <p className={cnBody()}>Here&apos;s what needs your attention.</p>
    </header>
  );
}

function cnBody() {
  return typographyClass("bodySmall", "mt-2 max-w-prose");
}

/** @deprecated Use DashboardPageHeader — kept for import compatibility during migration */
export function DashboardHeroSection(props: DashboardHeroSectionProps) {
  return <DashboardPageHeader {...props} />;
}
