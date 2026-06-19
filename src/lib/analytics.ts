"use client";

/**
 * Thin wrapper around Plausible custom events. No-ops gracefully when the
 * Plausible script is not loaded (e.g. local dev without the domain set).
 */

type PlausibleEvent =
  | "cta_book_call"
  | "cta_whatsapp"
  | "form_submit"
  | "view_case"
  | "chat_open";

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void;
  }
}

export function trackEvent(
  event: PlausibleEvent,
  props?: Record<string, string | number | boolean>,
): void {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    // Analytics must never break the UI.
  }
}
