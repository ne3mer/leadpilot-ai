import { cn } from "@/lib/utils";

export type SurfaceVariant = "subtle" | "elevated";

const surfaceVariants: Record<SurfaceVariant, string> = {
  subtle: "bg-surface-subtle border-border",
  elevated: "bg-surface border-border shadow-[var(--lp-shadow-overlay)]",
};

type SurfaceProps = {
  children: React.ReactNode;
  variant?: SurfaceVariant;
  className?: string;
  as?: "div" | "section" | "article";
};

/** Working surface — use sparingly; prefer plain content + dividers when possible */
export function Surface({ children, variant = "subtle", className, as: Tag = "div" }: SurfaceProps) {
  return (
    <Tag
      className={cn(
        "rounded-md border p-[var(--lp-space-surface-padding)]",
        surfaceVariants[variant],
        className
      )}
    >
      {children}
    </Tag>
  );
}
