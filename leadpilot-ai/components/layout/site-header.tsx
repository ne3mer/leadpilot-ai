"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { AppBottomNav } from "@/components/layout/app-bottom-nav";
import { appNavLinks } from "@/lib/app-navigation";
import {
  appNavLinkClassName,
  appNavLinkIndicatorClassName,
  isAppNavLinkActive,
} from "@/lib/app-nav-active";
import { navLinks } from "@/lib/mock-data";
import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type SiteHeaderProps = {
  sessionUser?: {
    email: string;
  } | null;
};

function useLocationHash() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  return { pathname: pathname ?? "", hash };
}

export function SiteHeader({ sessionUser }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuId = useId();
  const isAuthenticated = Boolean(sessionUser);
  const primaryLinks = isAuthenticated ? appNavLinks : navLinks;
  const { pathname, hash } = useLocationHash();

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

  if (isAuthenticated) {
    return (
      <>
        <header className="sticky top-0 z-40 border-b border-border bg-surface">
          <Container className="flex h-14 items-center justify-between gap-4">
            <Link
              href="/dashboard"
              className="lp-focus-ring shrink-0 rounded-sm text-[length:var(--lp-text-body-size)] font-semibold tracking-tight text-primary"
            >
              LeadPilot
            </Link>

            <nav className="hidden flex-1 justify-center md:flex" aria-label="Primary">
              <ul className="flex items-center gap-8">
                {appNavLinks.map((link) => {
                  const active = isAppNavLinkActive(link.href, pathname, hash);
                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={`lp-focus-ring relative inline-flex flex-col items-center gap-1 rounded-sm px-1 py-1 ${appNavLinkClassName(active)}`}
                      >
                        <span className="text-[length:var(--lp-text-body-small-size)]">
                          {link.label}
                        </span>
                        <span
                          className={`h-0.5 w-full min-w-[2rem] rounded-full ${appNavLinkIndicatorClassName(active)}`}
                          aria-hidden
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex min-w-0 items-center justify-end gap-2">
              <Link
                href="/dashboard/settings/profile"
                className="lp-focus-ring hidden max-w-[12rem] truncate rounded-sm px-2 py-1 text-[length:var(--lp-text-metadata-size)] text-secondary hover:text-primary sm:inline"
                title={sessionUser?.email}
              >
                {sessionUser?.email}
              </Link>
              <SignOutButton className="hidden md:inline-flex" />
              <button
                type="button"
                className="lp-focus-ring inline-flex min-h-10 min-w-10 items-center justify-center rounded-sm border border-border bg-surface text-secondary hover:bg-surface-subtle md:hidden"
                aria-expanded={mobileOpen}
                aria-controls={menuId}
                aria-label={mobileOpen ? "Close menu" : "Account menu"}
                onClick={() => setMobileOpen((open) => !open)}
              >
                {mobileOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
              </button>
            </div>
          </Container>

          {mobileOpen ? (
            <div
              id={menuId}
              className="border-t border-border bg-surface px-[var(--lp-gutter-mobile)] py-4 md:hidden"
              role="dialog"
              aria-label="Account menu"
            >
              <p className="lp-text-metadata break-all text-muted">
                Signed in as{" "}
                <span className="font-medium text-primary">{sessionUser?.email}</span>
              </p>
              <div className="mt-4">
                <SignOutButton className="inline-flex w-full justify-center" />
              </div>
            </div>
          ) : null}
        </header>
        <AppBottomNav pathname={pathname} hash={hash} />
      </>
    );
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-border bg-surface"
    >
      <Container className="flex items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-primary"
        >
          LeadPilot AI
        </Link>

        <ul className="hidden items-center gap-6 text-sm text-secondary md:flex">
          {primaryLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="transition hover:text-accent">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className={buttonClassName("primary", "hidden px-4 py-2 text-sm sm:inline-flex")}
          >
            Open App
          </Link>

          <button
            type="button"
            className="lp-focus-ring inline-flex items-center justify-center rounded-sm border border-border bg-surface p-2.5 text-secondary hover:bg-surface-subtle md:hidden"
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
          className="border-t border-border bg-surface px-[var(--lp-gutter-mobile)] py-4 md:hidden"
          role="dialog"
          aria-label="Mobile navigation"
        >
          <nav>
            <ul className="flex flex-col gap-1 text-sm text-secondary">
              {primaryLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="lp-focus-ring block rounded-sm px-3 py-2.5 hover:bg-surface-subtle hover:text-primary"
                    onClick={closeMobile}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            href="/dashboard"
            className={buttonClassName("primary", "mt-4 w-full px-4 py-2.5 text-sm")}
            onClick={closeMobile}
          >
            Open App
          </Link>
        </div>
      ) : null}
    </motion.header>
  );
}
