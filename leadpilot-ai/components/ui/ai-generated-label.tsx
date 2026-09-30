import { cn } from "@/lib/utils";

export type AiDisclosureVariant = "generated" | "draft" | "assisted";

type AiGeneratedLabelProps = {
  /** @deprecated Use `disclosure` — kept for existing imports */
  variant?: "default" | "draft";
  disclosure?: AiDisclosureVariant;
  className?: string;
};

const disclosureCopy: Record<AiDisclosureVariant, string> = {
  generated: "AI-generated",
  draft: "AI-generated draft",
  assisted: "AI-assisted",
};

export function AiGeneratedLabel({
  variant = "default",
  disclosure,
  className,
}: AiGeneratedLabelProps) {
  const resolved: AiDisclosureVariant =
    disclosure ?? (variant === "draft" ? "draft" : "generated");

  return (
    <span className={cn("lp-ai-disclosure", className)} role="note">
      {disclosureCopy[resolved]}
    </span>
  );
}
