"use client";

import { LogOut } from "lucide-react";
import { signOutAction } from "@/lib/auth/actions";

type SignOutButtonProps = {
  className?: string;
};

export function SignOutButton({ className }: SignOutButtonProps) {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className={
          className ??
          "inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
        }
      >
        <LogOut className="h-3.5 w-3.5" />
        Sign out
      </button>
    </form>
  );
}
