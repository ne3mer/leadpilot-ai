import { typographyClass } from "@/lib/design-system/typography";

type LeadDetailSectionProps = {
  index: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  id?: string;
  className?: string;
};

export function LeadDetailSection({
  index,
  title,
  description,
  children,
  id,
  className = "",
}: LeadDetailSectionProps) {
  return (
    <section
      id={id}
      className={`min-w-0 border-t border-border pt-[var(--lp-space-section)] ${className}`.trim()}
    >
      <header className="mb-[var(--lp-space-6)] max-w-prose">
        <p className="lp-text-caption tabular-nums text-muted">{index}</p>
        <h2 className={typographyClass("sectionTitle", "mt-1")}>{title}</h2>
        {description ? (
          <p className={typographyClass("bodySmall", "mt-2")}>{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
