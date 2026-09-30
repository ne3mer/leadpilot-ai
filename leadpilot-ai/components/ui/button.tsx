import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "dark";

const buttonBaseClassName =
  "inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-[background-color,border-color,color,box-shadow] duration-[var(--lp-duration-fast)] ease-[var(--lp-ease-default)] lp-focus-ring disabled:pointer-events-none disabled:opacity-50";

const buttonVariantClassNames: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-accent text-accent-foreground hover:bg-accent-hover",
  secondary:
    "border border-border bg-surface text-primary hover:bg-surface-subtle",
  ghost: "border border-transparent bg-transparent text-secondary hover:bg-surface-subtle hover:text-primary",
  danger:
    "border border-transparent bg-danger-muted text-danger hover:border-[color:var(--lp-danger)]/25",
  /** @deprecated Prefer `secondary` in app UI — kept for marketing/pricing compatibility */
  dark: "border border-transparent bg-primary text-inverse hover:bg-accent",
};

export function buttonClassName(variant: ButtonVariant = "primary", className?: string) {
  return cn(buttonBaseClassName, buttonVariantClassNames[variant], className);
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
};

export function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonClassName(variant, className)} {...props}>
      {children}
    </button>
  );
}
