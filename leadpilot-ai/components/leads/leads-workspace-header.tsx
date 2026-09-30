import { typographyClass } from "@/lib/design-system/typography";

type LeadsWorkspaceHeaderProps = {
  resultCountLabel?: string;
};

export function LeadsWorkspaceHeader({ resultCountLabel }: LeadsWorkspaceHeaderProps) {
  return (
    <header className="flex min-w-0 flex-wrap items-end justify-between gap-3 border-b border-border pb-[var(--lp-space-6)]">
      <div className="min-w-0 max-w-prose">
        <h2 className={typographyClass("pageTitle")}>Leads</h2>
        <p className={typographyClass("bodySmall", "mt-2")}>
          Manage your pipeline and focus on the opportunities that need attention.
        </p>
      </div>
      {resultCountLabel ? (
        <p className="lp-text-metadata tabular-nums text-muted">{resultCountLabel}</p>
      ) : null}
    </header>
  );
}
