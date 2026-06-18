import { defineRouting } from "next-intl/routing";

export const locales = ["it", "en"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "it",
  localePrefix: "as-needed",
});
