"use client";

import Link from "next/link";
import { appNavLinks } from "@/lib/app-navigation";
import {
  appNavLinkClassName,
  appNavLinkIndicatorClassName,
  isAppNavLinkActive,
} from "@/lib/app-nav-active";

type AppBottomNavProps = {
  pathname: string;
  hash: string;
};

export function AppBottomNav({ pathname, hash }: AppBottomNavProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface md:hidden"
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-[var(--lp-container-max)]">
        {appNavLinks.map((link) => {
          const active = isAppNavLinkActive(link.href, pathname, hash);
          return (
            <li key={link.label} className="min-w-0 flex-1">
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`lp-focus-ring flex min-h-14 flex-col items-center justify-center gap-1 px-2 py-2 text-center ${appNavLinkClassName(active)}`}
              >
                <span
                  className={`h-0.5 w-8 rounded-full ${appNavLinkIndicatorClassName(active)}`}
                  aria-hidden
                />
                <span className="text-[length:var(--lp-text-caption-size)] leading-none">
                  {link.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
