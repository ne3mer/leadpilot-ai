import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

const toneClassNames: Record<BadgeTone, string> = {
  neutral: "bg-surface-subtle text-secondary border-border-subtle",
  accent: "bg-accent-muted text-accent border-transparent",
  success: "bg-success-muted text-success border-transparent",
  warning: "bg-warning-muted text-warning border-transparent",
  danger: "bg-danger-muted text-danger border-transparent",
};

/** Restrained badge base — status/priority use dedicated token classes */
export function badgeClassName(tone: BadgeTone = "neutral", className?: string) {
  return cn(
    "inline-flex max-w-full items-center rounded-sm border px-2 py-0.5 text-[length:var(--lp-text-caption-size)] font-medium leading-[var(--lp-text-caption-leading)] tabular-nums",
    toneClassNames[tone],
    className
  );
}

type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return <span className={badgeClassName(tone, className)}>{children}</span>;
}
