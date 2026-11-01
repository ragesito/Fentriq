/**
 * Central site configuration. Public values can be overridden via env vars.
 */

export const siteConfig = {
  name: "Fentriq",
  owner: "Marcelo Amaro",
  domain: "fentriq.app",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fentriq.app",
  email: "info@fentriq.app",
  phone: { display: "+39 334 384 0594", e164: "+393343840594" },
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "fentriq.app",
  vatNumber: "", // P.IVA — completare quando disponibile (lasciare vuoto la nasconde)
  social: {
    x: "https://x.com/fentriq",
    instagram: "https://www.instagram.com/fentriq/",
    facebook: "https://www.facebook.com/profile.php?id=61590905591349",
  },
  serviceAreas: ["Roma", "Milano", "Firenze", "Italia"],
} as const;
