import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
};

export function SectionHeading({
  title,
  description,
  centered = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-12", centered && "text-center", className)}>
      <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">{title}</h2>
      {description ? (
        <p className={cn("mt-4 text-slate-600", centered && "mx-auto max-w-2xl")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
