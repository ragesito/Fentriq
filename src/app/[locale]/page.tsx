import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { Showcase } from "@/components/sections/Showcase";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Process } from "@/components/sections/Process";
import { WhyUs } from "@/components/sections/WhyUs";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";
import { FoldDivider } from "@/components/ui/FoldDivider";
import { OrganizationJsonLd } from "@/components/JsonLd";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <OrganizationJsonLd locale={locale} />
      <Hero />
      <Showcase />
      <FoldDivider />
      <Services />
      <Work />
      <Process />
      <WhyUs />
      <FoldDivider flip />
      <Pricing />
      <FAQ />
      <CTASection />
    </>
  );
}
