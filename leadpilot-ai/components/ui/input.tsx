import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const controlBaseClassName =
  "lp-focus-ring w-full min-h-[var(--lp-control-height)] rounded-sm border border-border bg-surface px-3 text-primary placeholder:text-muted transition-[border-color,box-shadow] duration-[var(--lp-duration-fast)] disabled:cursor-not-allowed disabled:opacity-50";

export function inputClassName(className?: string, state?: "default" | "error") {
  return cn(
    controlBaseClassName,
    "py-2 text-[length:var(--lp-text-body-size)] leading-[var(--lp-text-body-leading)]",
    state === "error" && "border-danger",
    className
  );
}

export function selectClassName(className?: string, state?: "default" | "error") {
  return cn(
    controlBaseClassName,
    "py-2 text-[length:var(--lp-text-body-size)]",
    state === "error" && "border-danger",
    className
  );
}

export function textareaClassName(className?: string, state?: "default" | "error") {
  return cn(
    controlBaseClassName,
    "min-h-[6rem] resize-y py-2 text-[length:var(--lp-text-body-size)] leading-[var(--lp-text-body-leading)]",
    state === "error" && "border-danger",
    className
  );
}

export function fieldLabelClassName(className?: string) {
  return cn("block lp-text-body-small font-medium text-secondary", className);
}

export function fieldHintClassName(className?: string) {
  return cn("mt-1 lp-text-caption", className);
}

export function fieldErrorClassName(className?: string) {
  return cn("mt-1 lp-text-caption text-danger", className);
}

type InputProps = ComponentPropsWithoutRef<"input"> & {
  error?: boolean;
};

export function Input({ className, error, ...props }: InputProps) {
  return <input className={inputClassName(className, error ? "error" : "default")} {...props} />;
}

type SelectProps = ComponentPropsWithoutRef<"select"> & {
  error?: boolean;
};

export function Select({ className, error, ...props }: SelectProps) {
  return <select className={selectClassName(className, error ? "error" : "default")} {...props} />;
}

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  error?: boolean;
};

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <textarea className={textareaClassName(className, error ? "error" : "default")} {...props} />
  );
}
