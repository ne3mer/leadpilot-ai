/**
 * Returns a safe internal post-login path, or null if untrusted.
 * Prevents open redirects to external URLs.
 */
export function resolveSafeRedirectPath(next: string | null | undefined): string | null {
  if (next == null || typeof next !== "string") {
    return null;
  }

  const trimmed = next.trim();
  if (trimmed.length === 0) {
    return null;
  }

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return null;
  }

  if (trimmed.includes("://") || trimmed.includes("\\")) {
    return null;
  }

  return trimmed;
}
