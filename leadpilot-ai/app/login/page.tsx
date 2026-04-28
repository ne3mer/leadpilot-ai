import Link from "next/link";
import { Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-2 text-indigo-200">
          <Lock className="h-4 w-4" />
          <p className="text-xs uppercase tracking-[0.16em]">Secure Access</p>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-white">Login</h1>
        <p className="mt-2 text-sm text-slate-300">
          Sign in to access your LeadPilot AI workspace.
        </p>

        <form className="mt-8 space-y-4">
          <label className="block text-sm text-slate-300">
            Email
            <input
              type="email"
              className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/80 px-4 py-2.5 text-white outline-none ring-indigo-400/40 transition focus:ring"
              placeholder="you@company.com"
            />
          </label>

          <label className="block text-sm text-slate-300">
            Password
            <input
              type="password"
              className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/80 px-4 py-2.5 text-white outline-none ring-indigo-400/40 transition focus:ring"
              placeholder="••••••••"
            />
          </label>

          <button
            type="button"
            className="mt-3 w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Continue
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Back to{" "}
          <Link href="/" className="text-slate-200 hover:text-white">
            homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
