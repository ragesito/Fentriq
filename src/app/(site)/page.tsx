import { Home } from "@/components/home/Home";
import { siteConfig } from "@/config/site";

/** Structured data: who is behind the site and how to reach them. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      inLanguage: "it",
    },
    {
      "@type": "Person",
      "@id": `${siteConfig.url}/#marcelo`,
      name: siteConfig.owner,
      jobTitle: "Software developer",
      worksFor: { "@id": `${siteConfig.url}/#fentriq` },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteConfig.url}/#fentriq`,
      name: siteConfig.name,
      description:
        "Siti, app, automazioni e intelligenza artificiale su misura, dall'idea al lancio.",
      url: siteConfig.url,
      email: siteConfig.email,
      telephone: siteConfig.phone.e164,
      image: `${siteConfig.url}/icon-512.png`,
      logo: `${siteConfig.url}/brand/fentriq-primary.svg`,
      founder: { "@id": `${siteConfig.url}/#marcelo` },
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
      sameAs: [siteConfig.social.x, siteConfig.social.instagram, siteConfig.social.facebook],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Home />
    </>
  );
}
