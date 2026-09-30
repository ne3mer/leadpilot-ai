import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** Full-bleed inner content can opt out of max-width */
  wide?: boolean;
};

export function Container({ children, className, wide = false }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-[var(--lp-gutter-mobile)] md:px-[var(--lp-gutter-desktop)]",
        !wide && "max-w-[var(--lp-container-max)]",
        className
      )}
    >
      {children}
    </div>
  );
}
