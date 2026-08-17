import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Sparkles,
  TrendingUp,
  Key,
  Wrench,
  Check,
  ArrowRight,
  PhoneCall,
  MessageSquare,
  Workflow,
  Smartphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { CalButton } from "@/components/ui/CalButton";
import { buttonClasses } from "@/components/ui/Button";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Accordion } from "@/components/ui/Accordion";
import { CTASection } from "@/components/sections/CTASection";
import { Link } from "@/i18n/navigation";
import { getCaseStudy } from "@/content/work";

const STEPS: { key: "s1" | "s2" | "s3" | "s4"; icon: LucideIcon }[] = [
  { key: "s1", icon: Sparkles },
  { key: "s2", icon: TrendingUp },
  { key: "s3", icon: Key },
  { key: "s4", icon: Wrench },
];

const INCLUDE_KEYS = ["i1", "i2", "i3", "i4", "i5", "i6"] as const;

const MODULES: { key: "agent" | "whatsapp" | "flows" | "apps"; icon: LucideIcon }[] = [
  { key: "agent", icon: PhoneCall },
  { key: "whatsapp", icon: MessageSquare },
  { key: "flows", icon: Workflow },
  { key: "apps", icon: Smartphone },
];
const FAQ_KEYS = ["stop", "own", "fast", "report", "after"] as const;
const PROOF_SLUGS = ["nonsolofitness", "schiano", "mecs-village"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "formula" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: locale === "it" ? "/formula" : `/${locale}/formula`,
      languages: { it: "/formula", en: "/en/formula", "x-default": "/formula" },
    },
  };
}

export default async function FormulaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("formula");

  const proof = PROOF_SLUGS.map((slug) => getCaseStudy(slug)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s?.cover),
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bg pt-32 pb-20 sm:pb-24">
        <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
        <div
          aria-hidden
          className="animate-glow-pulse pointer-events-none absolute -top-40 right-0 h-[36rem] w-[36rem] rounded-full bg-accent/15 blur-[120px]"
        />
        <div aria-hidden className="noise" />

        <Container className="relative">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Reveal>
                <Eyebrow>{t("eyebrow")}</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="mt-5 text-[clamp(2.5rem,5.5vw,4rem)] font-bold leading-[1.06] tracking-[-0.03em]">
                  {t("titleBefore")}{" "}
                  <span className="text-gradient-animated">{t("titlePrice")}</span>
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
                  {t("subtitle")}
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <CalButton size="lg">{t("cta")}</CalButton>
                  <Link
                    href="/contatti"
                    className={buttonClasses("secondary", "lg")}
                  >
                    {t("ctaSecondary")}
                    <ArrowRight size={18} aria-hidden />
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8">
                  <Badge accent>{t("badge")}</Badge>
                </div>
              </Reveal>
            </div>

            {/* The formula as a till receipt — the object every shop owner knows */}
            <Reveal delay={0.15} className="hidden lg:block">
              <div className="relative mx-auto w-[340px] xl:w-[370px]">
                <div
                  aria-hidden
                  className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[90px]"
                />
                <div className="animate-collage relative rotate-2 rounded-sm bg-cream px-7 pb-7 pt-6 font-mono text-[13px] text-ink shadow-[0_30px_70px_-25px_rgba(0,0,0,0.8)] [--tilt:2deg]">
                  <div aria-hidden className="noise" />
                  <p className="text-center text-sm font-bold uppercase tracking-[0.2em]">
                    Fentriq
                  </p>
                  <p className="mt-1 text-center text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                    {t("receipt.header")} · {t("receipt.location")}
                  </p>
                  <div aria-hidden className="my-4 border-t border-dashed border-ink/25" />
                  <dl className="space-y-2.5">
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-ink-muted">{t("receipt.r1l")}</dt>
                      <dd className="font-semibold">{t("receipt.r1v")}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-ink-muted">{t("receipt.r2l")}</dt>
                      <dd className="font-semibold">{t("receipt.r2v")}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-ink-muted">{t("receipt.r3l")}</dt>
                      <dd className="font-semibold">{t("receipt.r3v")}</dd>
                    </div>
                  </dl>
                  <div aria-hidden className="my-4 border-t border-dashed border-ink/25" />
                  <div className="flex items-baseline justify-between gap-4 text-[15px] font-bold">
                    <span className="uppercase tracking-wide">
                      {t("receipt.totalLabel")}
                    </span>
                    <span className="text-accent-deep">{t("receipt.totalValue")}</span>
                  </div>
                  <div aria-hidden className="my-4 border-t border-dashed border-ink/25" />
                  <p className="text-center text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                    {t("receipt.footer")}
                  </p>
                  {/* Barcode */}
                  <div
                    aria-hidden
                    className="mt-4 h-9 w-full opacity-80 [background:repeating-linear-gradient(90deg,var(--color-ink)_0_2px,transparent_2px_5px),repeating-linear-gradient(90deg,var(--color-ink)_0_1px,transparent_1px_9px)]"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* How it works — cream route line, like the home process */}
      <Section tone="light">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>{t("how.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-semibold">
              {t("how.title")}
            </h2>
          </Reveal>
        </div>

        <ol className="relative mt-16 grid gap-12 lg:grid-cols-4 lg:gap-8">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-accent-deep/60 via-ink/20 to-ink/5 lg:block"
          />
          <div
            aria-hidden
            className="absolute bottom-6 left-7 top-2 w-px bg-gradient-to-b from-accent-deep/60 via-ink/20 to-ink/5 lg:hidden"
          />
          {STEPS.map(({ key, icon: Icon }, i) => {
            const owned = key === "s3";
            return (
              <Reveal as="li" key={key} delay={0.07 * i} className="relative pl-20 lg:pl-0">
                <div className="absolute left-0 top-0 lg:relative lg:left-auto lg:top-auto">
                  <div
                    className={
                      owned
                        ? "relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-deep text-white shadow-[0_10px_30px_-8px_rgba(59,69,214,0.55)]"
                        : "relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-accent-deep shadow-[0_10px_30px_-12px_rgba(21,23,28,0.35)] ring-1 ring-ink/10"
                    }
                  >
                    <Icon size={24} aria-hidden />
                  </div>
                </div>
                <div className="lg:mt-7">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm font-semibold text-accent-deep">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-xl font-semibold">
                      {t(`how.steps.${key}.title`)}
                    </h3>
                  </div>
                  <p className="mt-2.5 max-w-xs text-[15px] leading-relaxed text-muted">
                    {t(`how.steps.${key}.description`)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </Section>

      {/* What the first month includes + the other two doors */}
      <Section tone="default">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>{t("includes.eyebrow")}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 text-[clamp(1.8rem,3.4vw,2.5rem)] font-semibold">
                {t("includes.title")}
              </h2>
            </Reveal>
            <ul className="mt-8 space-y-4">
              {INCLUDE_KEYS.map((key, i) => (
                <Reveal as="li" key={key} delay={0.04 * i}>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <Check size={14} aria-hidden />
                    </span>
                    <span className="text-[17px] text-text/90">
                      {t(`includes.items.${key}`)}
                    </span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          <div>
            <Reveal>
              <Eyebrow>{t("paths.eyebrow")}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 text-[clamp(1.8rem,3.4vw,2.5rem)] font-semibold">
                {t("paths.title")}
              </h2>
            </Reveal>
            <div className="mt-8 space-y-5">
              <Reveal delay={0.05}>
                <SpotlightCard className="group">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-xl font-semibold">
                      {t("paths.upfront.title")}
                    </h3>
                    <span className="shrink-0 font-mono text-sm text-accent">
                      {t("paths.upfront.price")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {t("paths.upfront.description")}
                  </p>
                </SpotlightCard>
              </Reveal>
              <Reveal delay={0.1}>
                <SpotlightCard className="gradient-ring group">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-xl font-semibold">
                      {t("paths.custom.title")}
                    </h3>
                    <span className="shrink-0 font-mono text-sm text-accent">
                      {t("paths.custom.price")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {t("paths.custom.description")}
                  </p>
                  <Link
                    href="/contatti"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-2"
                  >
                    {t("paths.custom.cta")}
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                </SpotlightCard>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      {/* Beyond the showcase — the rest of the catalog as upgrades */}
      <Section tone="light">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>{t("modules.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-semibold">
              {t("modules.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-lg text-muted">{t("modules.subtitle")}</p>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map(({ key, icon: Icon }, i) => (
            <Reveal as="li" key={key} delay={0.05 * i}>
              <div className="h-full rounded-[var(--radius)] bg-white/70 p-6 shadow-[0_10px_30px_-16px_rgba(21,23,28,0.3)] ring-1 ring-ink/10">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-deep/10 text-accent-deep">
                  <Icon size={22} aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-semibold">
                  {t(`modules.items.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {t(`modules.items.${key}.description`)}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Local proof */}
      <Section tone="surface">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>{t("proof.eyebrow")}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 text-[clamp(1.8rem,3.4vw,2.5rem)] font-semibold">
                {t("proof.title")}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-muted">{t("proof.subtitle")}</p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Link
              href="/lavori"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-2"
            >
              {t("proof.cta")}
              <ArrowRight size={16} aria-hidden />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {proof.map((study, i) => (
            <Reveal key={study.slug} delay={0.06 * i}>
              <Link
                href={`/lavori/${study.slug}`}
                className="group block transition-transform duration-300 hover:-translate-y-1"
              >
                <BrowserFrame
                  label={
                    study.links.live?.replace(/^https?:\/\/(www\.)?/, "") ??
                    study.title
                  }
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={study.cover!}
                      alt={study.title}
                      fill
                      sizes="(min-width:640px) 33vw, 100vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                </BrowserFrame>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Formula FAQ */}
      <Section tone="default">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Reveal>
              <Eyebrow>{t("faq.eyebrow")}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-semibold">
                {t("faq.title")}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.05}>
            <Accordion
              items={FAQ_KEYS.map((k) => ({
                q: t(`faq.items.${k}.q`),
                a: t(`faq.items.${k}.a`),
              }))}
            />
          </Reveal>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
