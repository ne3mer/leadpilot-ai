"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { navLinks } from "@/lib/mock-data";
import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type SiteHeaderProps = {
  sessionUser?: {
    email: string;
  } | null;
};

export function SiteHeader({ sessionUser }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuId = useId();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur"
    >
      <Container className="flex items-center justify-between gap-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-black">
          LeadPilot AI
        </Link>

        <ul className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="transition hover:text-emerald-700">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {sessionUser ? (
            <>
              <span className="hidden max-w-[12rem] truncate text-xs font-medium text-slate-600 sm:inline">
                {sessionUser.email}
              </span>
              <SignOutButton className="hidden sm:inline-flex" />
            </>
          ) : (
            <Link
              href="/dashboard"
              className={buttonClassName("primary", "hidden px-4 py-2 text-sm sm:inline-flex")}
            >
              Open App
            </Link>
          )}

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white p-2.5 text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700 md:hidden"
            aria-expanded={mobileOpen}
            aria-controls={menuId}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {mobileOpen ? (
        <div
          id={menuId}
          className="border-t border-black/10 bg-white/95 px-6 py-4 md:hidden"
          role="dialog"
          aria-label="Mobile navigation"
        >
          {sessionUser ? (
            <div className="mb-3 rounded-xl border border-black/10 bg-slate-50 px-3 py-2 text-xs text-slate-600">
              Signed in as <span className="font-medium text-black">{sessionUser.email}</span>
            </div>
          ) : null}

          <nav>
            <ul className="flex flex-col gap-1 text-sm text-slate-700">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="block rounded-xl px-3 py-2.5 transition hover:bg-emerald-50 hover:text-emerald-800"
                    onClick={closeMobile}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {sessionUser ? (
            <div className="mt-4">
              <SignOutButton className="inline-flex w-full justify-center px-4 py-2.5 text-sm" />
            </div>
          ) : (
            <Link
              href="/dashboard"
              className={buttonClassName("primary", "mt-4 w-full px-4 py-2.5 text-sm")}
              onClick={closeMobile}
            >
              Open App
            </Link>
          )}
        </div>
      ) : null}
    </motion.header>
  );
}
