"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Lock } from "lucide-react";
import { signInAction, signUpAction, type AuthActionState } from "@/lib/auth/actions";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";

const initialState: AuthActionState = {};

export function LoginForm() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [signInState, signInFormAction, signInPending] = useActionState(signInAction, initialState);
  const [signUpState, signUpFormAction, signUpPending] = useActionState(signUpAction, initialState);

  const isPending = signInPending || signUpPending;
  const state = mode === "sign-in" ? signInState : signUpState;
  const formAction = mode === "sign-in" ? signInFormAction : signUpFormAction;

  return (
    <Card className="relative w-full max-w-md p-8">
      <div className="mb-6 flex items-center gap-2 text-emerald-700">
        <Lock className="h-4 w-4" />
        <p className="text-xs uppercase tracking-[0.16em]">Secure Access</p>
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-black">
        {mode === "sign-in" ? "Sign in" : "Create account"}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        {mode === "sign-in"
          ? "Sign in to access your LeadPilot AI workspace."
          : "Create an account to start managing leads in LeadPilot AI."}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl border border-black/10 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => setMode("sign-in")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            mode === "sign-in" ? "bg-white text-black shadow-sm" : "text-slate-600"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("sign-up")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            mode === "sign-up" ? "bg-white text-black shadow-sm" : "text-slate-600"
          }`}
        >
          Sign up
        </button>
      </div>

      <form action={formAction} className="mt-8 space-y-4">
        <label className="block text-sm text-slate-700">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={isPending}
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-black outline-none ring-emerald-400/40 transition focus:ring disabled:opacity-60"
            placeholder="you@company.com"
          />
        </label>

        <label className="block text-sm text-slate-700">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            disabled={isPending}
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-black outline-none ring-emerald-400/40 transition focus:ring disabled:opacity-60"
            placeholder="••••••••"
          />
        </label>

        {state.error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {state.error}
          </p>
        ) : null}

        {state.message ? (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className={`${buttonClassName("primary", "w-full rounded-xl px-4 py-2.5")} disabled:cursor-not-allowed disabled:opacity-70`}
        >
          {isPending
            ? "Please wait…"
            : mode === "sign-in"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Back to{" "}
        <Link href="/" className="text-black hover:text-emerald-700">
          homepage
        </Link>
      </p>
    </Card>
  );
}
