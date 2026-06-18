"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import { Calendar } from "lucide-react";
import { buttonClasses } from "./Button";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const NAMESPACE = "discovery";

/**
 * Opens the Cal.com booking modal (themed dark) for the discovery call.
 * Falls back to a plain link to cal.com if the embed fails to load.
 */
export function CalButton({
  children,
  variant = "primary",
  size = "md",
  className,
  withIcon = true,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
  withIcon?: boolean;
}) {
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const cal = await getCalApi({ namespace: NAMESPACE });
        if (!active) return;
        // Point the embed at the correct region (cal.eu for EU accounts).
        cal("init", NAMESPACE, { origin: siteConfig.calOrigin });
        cal("ui", {
          theme: "dark",
          cssVarsPerTheme: {
            light: { "cal-brand": "#4F5BF7" },
            dark: { "cal-brand": "#4F5BF7" },
          },
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      } catch {
        // Embed unavailable — the data attributes still deep-link to cal.com.
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <a
      href={`${siteConfig.calOrigin}/${siteConfig.calLink}`}
      data-cal-namespace={NAMESPACE}
      data-cal-link={siteConfig.calLink}
      data-cal-origin={siteConfig.calOrigin}
      data-cal-config='{"layout":"month_view","theme":"dark"}'
      onClick={() => trackEvent("cta_book_call")}
      className={cn(buttonClasses(variant, size), className)}
    >
      {withIcon ? <Calendar size={18} aria-hidden /> : null}
      {children}
    </a>
  );
}
