import { cn } from "@/lib/utils";
import { typographyClass } from "@/lib/design-system/typography";

type SectionHeadingProps = {
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
};

export function SectionHeading({
  title,
  description,
  centered = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-[var(--lp-space-12)]", centered && "text-center", className)}>
      <h2 className={typographyClass("display", "sm:text-[2.25rem]")}>{title}</h2>
      {description ? (
        <p className={cn(typographyClass("bodySmall"), "mt-4", centered && "mx-auto max-w-2xl")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
