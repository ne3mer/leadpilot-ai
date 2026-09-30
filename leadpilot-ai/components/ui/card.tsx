import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Legacy elevated container — prefer {@link Surface} or plain {@link Section} in new work.
 * Visual language updated to match tokens (no shadow by default).
 */
export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn("rounded-md border border-border bg-surface", className)}
    >
      {children}
    </div>
  );
}
