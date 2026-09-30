import { AiGeneratedLabel } from "@/components/ui/ai-generated-label";
import { typographyClass } from "@/lib/design-system/typography";
import type { AiDisclosureVariant } from "@/components/ui/ai-generated-label";

type AiGuidanceBlockProps = {
  title: string;
  description: string;
  disclosure?: AiDisclosureVariant;
  children: React.ReactNode;
  className?: string;
};

/** Shared typography for on-demand AI surfaces on lead detail. */
export function AiGuidanceBlock({
  title,
  description,
  disclosure = "assisted",
  children,
  className = "",
}: AiGuidanceBlockProps) {
  return (
    <div className={`min-w-0 ${className}`.trim()}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <AiGeneratedLabel disclosure={disclosure} />
        <h3 className={typographyClass("subsection")}>{title}</h3>
      </div>
      <p className={typographyClass("bodySmall", "mt-2 max-w-prose text-secondary")}>
        {description}
      </p>
      <div className="mt-[var(--lp-space-4)]">{children}</div>
    </div>
  );
}
