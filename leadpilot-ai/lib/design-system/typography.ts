import { cn } from "@/lib/utils";

/** Semantic typography class names — pair with design tokens in globals.css */
export const typography = {
  display: "lp-text-display",
  pageTitle: "lp-text-page-title",
  sectionTitle: "lp-text-section-title",
  subsection: "lp-text-subsection",
  body: "lp-text-body",
  bodySmall: "lp-text-body-small",
  metadata: "lp-text-metadata",
  caption: "lp-text-caption",
} as const;

export type TypographyRole = keyof typeof typography;

export function typographyClass(role: TypographyRole, className?: string) {
  return cn(typography[role], className);
}
