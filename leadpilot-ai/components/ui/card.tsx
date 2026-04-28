import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return <div className={cn("rounded-2xl border border-black/10 bg-white shadow-sm", className)}>{children}</div>;
}
