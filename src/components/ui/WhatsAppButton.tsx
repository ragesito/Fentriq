"use client";

import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { whatsappUrl } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { buttonClasses } from "./Button";
import { cn } from "@/lib/cn";

const DEFAULT_PREFILL = "Ciao Fentriq, vorrei parlare di un progetto.";

/** Inline WhatsApp CTA (used in the final CTA section). */
export function WhatsAppButton({
  children,
  variant = "secondary",
  size = "md",
  className,
  prefill = DEFAULT_PREFILL,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
  prefill?: string;
}) {
  return (
    <a
      href={whatsappUrl(prefill)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("cta_whatsapp")}
      className={cn(buttonClasses(variant, size), className)}
    >
      <MessageCircle size={18} aria-hidden />
      {children}
    </a>
  );
}

/** Floating WhatsApp button, bottom-right. */
export function WhatsAppFloat() {
  const t = useTranslations("common");
  return (
    <a
      href={whatsappUrl(DEFAULT_PREFILL)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp")}
      onClick={() => trackEvent("cta_whatsapp", { location: "float" })}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#0B0C0F] shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <MessageCircle size={26} aria-hidden />
    </a>
  );
}
