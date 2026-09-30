import { Suspense } from "react";
import { LoginForm } from "@/app/login/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-8 text-center text-sm text-slate-600">
            Loading sign in…
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
