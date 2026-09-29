import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "dark";

export function buttonClassName(variant: ButtonVariant = "primary", className?: string) {
  return cn(
    "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold transition duration-300",
    variant === "primary" &&
      "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-[0_12px_28px_-12px_rgba(22,163,74,0.7)] hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-14px_rgba(22,163,74,0.75)]",
    variant === "secondary" &&
      "border border-black/15 bg-white/90 text-black hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-700",
    variant === "dark" && "bg-black text-white hover:bg-emerald-700",
    className
  );
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
