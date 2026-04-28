import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-black/10 bg-white/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-slate-600 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} LeadPilot AI. Built for modern revenue teams.</p>
        <div className="flex items-center gap-4">
          <Link href="/login" className="transition hover:text-emerald-700">
            Login
          </Link>
          <Link href="/dashboard" className="transition hover:text-emerald-700">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
