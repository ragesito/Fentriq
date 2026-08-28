"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getPathname, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * The middleware picks the locale for unprefixed paths from this cookie;
 * without setting it first, EN -> IT would bounce straight back to /en/…
 */
function hardNavigate(locale: string, href: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  window.location.assign(href);
}

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, setPending] = useState(false);

  /**
   * A full navigation on purpose, not a client-side route change. Switching
   * locale swaps the root `[locale]` segment, which remounts the whole
   * <head>; Chrome blanks the tab favicon when the <link rel="icon"> nodes
   * are removed and does not repaint it when identical ones come back. A
   * real page load sidesteps that, and language switches are rare enough
   * that the reload costs nothing (the entrance animation stays skipped —
   * it is keyed on sessionStorage).
   */
  function switchTo(next: string) {
    if (next === locale) return;
    setPending(true);
    const href = getPathname({
      // @ts-expect-error -- params are forwarded as-is for dynamic routes
      href: { pathname, params },
      locale: next,
    });
    hardNavigate(next, href);
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface p-0.5",
        className,
      )}
      role="group"
      aria-label={t("languageLabel")}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          disabled={isPending}
          aria-current={loc === locale ? "true" : undefined}
          className={cn(
            "rounded-full px-2.5 py-1 font-mono text-xs uppercase tracking-wider transition-colors",
            loc === locale
              ? "bg-accent text-on-accent"
              : "text-muted hover:text-text",
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
