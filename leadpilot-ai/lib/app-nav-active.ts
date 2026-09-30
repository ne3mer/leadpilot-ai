import { appNavLinks } from "@/lib/app-navigation";

export type AppNavLink = (typeof appNavLinks)[number];

export function isAppNavLinkActive(
  href: AppNavLink["href"],
  pathname: string,
  hash: string
): boolean {
  if (href.startsWith("/dashboard/settings")) {
    return pathname.startsWith("/dashboard/settings");
  }

  if (href.includes("#pipeline")) {
    return (
      pathname.startsWith("/dashboard/leads") ||
      (pathname === "/dashboard" && hash === "#pipeline")
    );
  }

  if (href === "/dashboard") {
    return pathname === "/dashboard" && hash !== "#pipeline";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function appNavLinkClassName(active: boolean) {
  return active
    ? "font-medium text-primary"
    : "text-secondary transition-colors duration-[var(--lp-duration-fast)] hover:text-primary";
}

export function appNavLinkIndicatorClassName(active: boolean) {
  return active ? "bg-accent" : "bg-transparent";
}
