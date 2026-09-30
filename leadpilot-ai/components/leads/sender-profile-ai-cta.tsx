import Link from "next/link";

type SenderProfileAiCtaProps = {
  hasSenderProfile: boolean;
  className?: string;
};

export function SenderProfileAiCta({ hasSenderProfile, className = "" }: SenderProfileAiCtaProps) {
  if (hasSenderProfile) {
    return null;
  }

  return (
    <p className={`text-sm text-slate-600 ${className}`.trim()}>
      <Link
        href="/dashboard/settings/profile"
        className="font-medium text-emerald-800 underline-offset-2 hover:text-emerald-600 hover:underline"
      >
        Add your Profile
      </Link>{" "}
      to improve AI-generated recommendations.
    </p>
  );
}
