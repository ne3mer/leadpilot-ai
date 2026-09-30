import { cn } from "@/lib/utils";

export type IconSize = "sm" | "md" | "lg";

const iconSizes: Record<IconSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

/** Default icon styling — muted, aligned with text */
export function iconClassName(size: IconSize = "md", className?: string) {
  return cn("shrink-0 text-muted", iconSizes[size], className);
}

/** Emphasis icon (accent context only) */
export function iconAccentClassName(size: IconSize = "md", className?: string) {
  return cn("shrink-0 text-accent", iconSizes[size], className);
}
