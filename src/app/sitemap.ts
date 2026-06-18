import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { caseStudies } from "@/content/work";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const paths = [
    "",
    "/lavori",
    "/contatti",
    "/privacy",
    "/cookie",
    ...caseStudies.map((c) => `/lavori/${c.slug}`),
  ];

  function url(locale: string, path: string) {
    if (locale === routing.defaultLocale) return `${base}${path}` || `${base}/`;
    return `${base}/${locale}${path}`;
  }

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: url(locale, path),
      lastModified: new Date("2026-06-18"),
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, url(l, path)]),
        ),
      },
    })),
  );
}
