import { cn } from "@/lib/utils";
import { typographyClass } from "@/lib/design-system/typography";

type SectionProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  /** Hairline below the section block */
  divider?: boolean;
  className?: string;
  id?: string;
};

/**
 * Editorial section — heading + description + content without default card chrome.
 */
export function Section({
  children,
  title,
  description,
  divider = false,
  className,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-[var(--lp-space-section)] first:pt-0 last:pb-0", className)}
    >
      {title ? (
        <header className="mb-[var(--lp-space-6)] max-w-prose">
          <h2 className={typographyClass("sectionTitle")}>{title}</h2>
          {description ? (
            <p className={cn(typographyClass("bodySmall"), "mt-2")}>{description}</p>
          ) : null}
        </header>
      ) : null}
      {children}
      {divider ? (
        <hr className="mt-[var(--lp-space-section)] border-0 border-t border-border" aria-hidden />
      ) : null}
    </section>
  );
}
