import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { WorkCard } from "@/components/sections/WorkCard";
import { CTASection } from "@/components/sections/CTASection";
import { getClientCases, getConceptCases, getLabCases } from "@/content/work";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "workPage" });
  return {
    title: t("title").replace(/\.$/, ""),
    description: t("subtitle"),
    alternates: {
      canonical: locale === "it" ? "/lavori" : `/${locale}/lavori`,
      languages: { it: "/lavori", en: "/en/lavori", "x-default": "/lavori" },
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("workPage");
  const clients = getClientCases();
  const concepts = getConceptCases();
  const lab = getLabCases();

  return (
    <>
      <Section tone="default" className="pt-28 pb-12">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 text-[clamp(2.5rem,5vw,4rem)] font-bold">
              {t("title")}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-lg text-muted">{t("subtitle")}</p>
          </Reveal>
        </div>

        <div className="mt-14 max-w-2xl">
          <Reveal>
            <h2 className="text-[clamp(1.6rem,3vw,2.25rem)] font-semibold">
              {t("clientsTitle")}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-3 text-muted">{t("clientsSubtitle")}</p>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {clients.map((study, i) => (
            <Reveal key={study.slug} delay={0.05 * Math.min(i, 4)}>
              <WorkCard study={study} />
            </Reveal>
          ))}
        </div>

        <div className="mt-20 max-w-2xl">
          <Reveal>
            <h2 className="text-[clamp(1.6rem,3vw,2.25rem)] font-semibold">
              {t("conceptsTitle")}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-3 text-muted">{t("conceptsSubtitle")}</p>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {concepts.map((study, i) => (
            <Reveal key={study.slug} delay={0.05 * Math.min(i, 4)}>
              <WorkCard study={study} />
            </Reveal>
          ))}
        </div>

        <div className="mt-20 max-w-2xl">
          <Reveal>
            <h2 className="text-[clamp(1.6rem,3vw,2.25rem)] font-semibold">
              {t("labTitle")}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-3 text-muted">{t("labSubtitle")}</p>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {lab.map((study, i) => (
            <Reveal key={study.slug} delay={0.05 * i}>
              <WorkCard study={study} />
            </Reveal>
          ))}
        </div>
      </Section>
      <CTASection />
    </>
  );
}
