/**
 * Central site configuration. Public values can be overridden via env vars.
 * Replace the placeholder business details (P.IVA, WhatsApp number, Cal link)
 * before going live.
 */

export const siteConfig = {
  name: "Fentriq",
  domain: "fentriq.app",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fentriq.app",
  // Studio di sviluppo software full-stack
  tagline: {
    it: "Studio di sviluppo software. Web, app, IA e automazioni su misura.",
    en: "Full-stack software studio. Custom web, apps, AI and automation.",
  },
  email: "hello@fentriq.app",
  // E.164 without the "+" sign for the wa.me link (e.g. 39XXXXXXXXXX)
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "393000000000",
  // Cal.com booking slug (e.g. "fentriq/discovery")
  calLink: process.env.NEXT_PUBLIC_CALCOM_LINK ?? "fentriq/discovery",
  // Booking origin — use https://cal.eu for EU-region accounts, https://cal.com otherwise.
  calOrigin: process.env.NEXT_PUBLIC_CALCOM_ORIGIN ?? "https://cal.com",
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "fentriq.app",
  vatNumber: "IT00000000000", // P.IVA — completare
  social: {
    github: "https://github.com/ragesito",
    linkedin: "https://www.linkedin.com/company/fentriq",
  },
  serviceAreas: ["Roma", "Milano", "Firenze", "Italia"],
} as const;

/** Builds the WhatsApp deep link with an optional prefilled message. */
export function whatsappUrl(prefill?: string): string {
  const base = `https://wa.me/${siteConfig.whatsapp}`;
  return prefill ? `${base}?text=${encodeURIComponent(prefill)}` : base;
}

export const navItems = [
  { key: "services", href: "/#servizi" },
  { key: "work", href: "/lavori" },
  { key: "contact", href: "/contatti" },
] as const;

export const footerLegal = [
  { key: "privacy", href: "/privacy" },
  { key: "cookie", href: "/cookie" },
] as const;
