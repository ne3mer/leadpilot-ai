import Link from "next/link";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent px-6">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <Card className="relative w-full max-w-md p-8">
        <div className="mb-6 flex items-center gap-2 text-emerald-700">
          <Lock className="h-4 w-4" />
          <p className="text-xs uppercase tracking-[0.16em]">Secure Access</p>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-black">Login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to access your LeadPilot AI workspace.
        </p>

        <form className="mt-8 space-y-4">
          <label className="block text-sm text-slate-700">
            Email
            <input
              type="email"
              className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-black outline-none ring-emerald-400/40 transition focus:ring"
              placeholder="you@company.com"
            />
          </label>

          <label className="block text-sm text-slate-700">
            Password
            <input
              type="password"
              className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-black outline-none ring-emerald-400/40 transition focus:ring"
              placeholder="••••••••"
            />
          </label>

          <button
            type="button"
            className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(22,163,74,0.7)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-14px_rgba(22,163,74,0.75)]"
          >
            Continue
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Back to <Link href="/" className="text-black hover:text-emerald-700">homepage</Link>
        </p>
      </Card>
    </div>
  );
}
