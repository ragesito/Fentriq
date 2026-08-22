import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { WorkGallery } from "@/components/work/WorkGallery";
import { CTASection } from "@/components/sections/CTASection";
import { getClientCases, getConceptCases, getLabCases } from "@/content/work";
import { cn } from "@/lib/cn";

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

  const stats = [
    { n: clients.length, label: t("stats.clients") },
    { n: concepts.length, label: t("stats.concepts") },
    { n: lab.length, label: t("stats.lab") },
  ];

  return (
    <>
      <Section tone="default" className="pt-12 pb-16 sm:pt-16" containerClassName="relative">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>{t("eyebrow")}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-3 text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.02em]">
                {t("title")}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-3 text-lg text-muted">{t("subtitle")}</p>
            </Reveal>
          </div>

          {/* The numbers that matter, at a glance */}
          <Reveal delay={0.15}>
            <dl className="relative grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-xl border border-accent/30 bg-gradient-to-br from-accent/20 via-surface to-accent-2/10 shadow-[0_20px_60px_-30px_rgba(79,91,247,0.6)] lg:min-w-[26rem]">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/40 blur-3xl"
              />
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="relative flex flex-col items-center justify-start px-4 py-4 text-center sm:px-6 sm:py-5"
                >
                  <dd
                    className={cn(
                      "order-1 font-display text-3xl font-bold tabular-nums leading-none sm:text-4xl",
                      i === 0
                        ? "text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.75)]"
                        : i === 1
                          ? "text-[#8B94FF]"
                          : "text-[#C3B3FF]",
                    )}
                  >
                    {s.n}
                  </dd>
                  <dt className="order-2 mt-2 max-w-[7rem] text-[11px] leading-snug text-text/80 sm:text-xs">
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="mt-10">
          <WorkGallery clients={clients} concepts={concepts} lab={lab} />
        </div>
      </Section>
      <CTASection />
    </>
  );
}
