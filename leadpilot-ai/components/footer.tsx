import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-950/60">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-slate-400 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} LeadPilot AI. Built for modern revenue teams.</p>
        <div className="flex items-center gap-4">
          <Link href="/login" className="transition hover:text-white">
            Login
          </Link>
          <Link href="/dashboard" className="transition hover:text-white">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
