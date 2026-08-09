import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";

/** ProfessionalService structured data for the home page. */
export function OrganizationJsonLd({ locale }: { locale: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    description:
      locale === "it"
        ? "Studio di sviluppo software: web, app, IA, automazioni, Web3."
        : "Software development studio: web, apps, AI, automation, Web3.",
    url: siteConfig.url,
    email: siteConfig.email,
    image: `${siteConfig.url}/icon-512.png`,
    logo: `${siteConfig.url}/brand/fentriq-primary.svg`,
    areaServed: siteConfig.serviceAreas,
    knowsAbout: [
      "Web development",
      "Mobile and web apps",
      "Artificial intelligence",
      "Algorithms",
      "Automation",
      "Software development",
      "Web3",
    ],
    sameAs: [siteConfig.social.x, siteConfig.social.instagram],
    priceRange: "€€",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** FAQPage structured data — mirrors the five questions in the home FAQ. */
export async function FaqJsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "faq" });
  const keys = ["cost", "time", "where", "ownership", "scope"] as const;

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: keys.map((key) => ({
      "@type": "Question",
      name: t(`items.${key}.q`),
      acceptedAnswer: { "@type": "Answer", text: t(`items.${key}.a`) },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
