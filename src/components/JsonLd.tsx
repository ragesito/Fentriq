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
      "AI",
      "Automation",
      "Web3",
      "Next.js",
      "Solana",
    ],
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
    priceRange: "€€",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
