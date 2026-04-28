import Link from "next/link";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-black/10 bg-white/80">
      <Container className="flex flex-col gap-4 py-10 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} LeadPilot AI. Built for modern revenue teams.</p>
        <div className="flex items-center gap-4">
          <Link href="/login" className="transition hover:text-emerald-700">
            Login
          </Link>
          <Link href="/dashboard" className="transition hover:text-emerald-700">
            Dashboard
          </Link>
        </div>
      </Container>
    </footer>
  );
}
