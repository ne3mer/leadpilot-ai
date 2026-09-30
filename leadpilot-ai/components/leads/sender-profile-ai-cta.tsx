import Link from "next/link";
import { typographyClass } from "@/lib/design-system/typography";

type SenderProfileAiCtaProps = {
  hasSenderProfile: boolean;
  className?: string;
};

export function SenderProfileAiCta({ hasSenderProfile, className = "" }: SenderProfileAiCtaProps) {
  if (hasSenderProfile) {
    return null;
  }

  return (
    <p className={`${typographyClass("bodySmall", "text-secondary")} ${className}`.trim()}>
      <Link
        href="/dashboard/settings/profile"
        className="lp-focus-ring font-medium text-accent underline-offset-2 hover:underline"
      >
        Add your profile
      </Link>{" "}
      to make AI suggestions more specific.
    </p>
  );
}
