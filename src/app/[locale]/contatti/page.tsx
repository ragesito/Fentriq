import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Calendar, Check, Mail, Store } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { CalButton } from "@/components/ui/CalButton";
import { ContactForm } from "@/components/sections/ContactForm";
import { OpenChatButton } from "@/components/chat/OpenChatButton";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title").replace(/\.$/, ""),
    description: t("subtitle"),
    alternates: {
      canonical: locale === "it" ? "/contatti" : `/${locale}/contatti`,
      languages: {
        it: "/contatti",
        en: "/en/contatti",
        "x-default": "/contatti",
      },
    },
  };
}

const POINTS = ["reply", "human", "noCommit"] as const;

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tc = await getTranslations("common");

  return (
    <Section
      tone="default"
      className="pt-12 sm:pt-16"
      containerClassName="relative"
    >
      {/* Ambient brand light behind the header, like the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[60rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]"
      />

      <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* Left: header + form */}
        <div>
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
            <Reveal delay={0.15}>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                {POINTS.map((k) => (
                  <li key={k} className="flex items-center gap-2">
                    <Check size={15} className="text-accent" aria-hidden />
                    {t(`points.${k}`)}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal className="mt-8">
            <ContactForm />
          </Reveal>
        </div>

        {/* Booking, direct channels, and the Formula door */}
        <Reveal delay={0.05}>
          <aside className="space-y-5 lg:mt-16">
            <div className="border-beam relative overflow-hidden rounded-[var(--radius)] border border-white/15 bg-white/[0.07] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl backdrop-saturate-150">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
              <Calendar className="text-accent" size={24} aria-hidden />
              <h2 className="mt-4 text-xl font-semibold">{t("bookTitle")}</h2>
              <p className="mt-2 text-sm text-muted">{t("bookSubtitle")}</p>
              <div className="mt-5">
                <CalButton size="lg" className="w-full">
                  {tc("bookCall")}
                </CalButton>
              </div>

              <div className="mt-7 space-y-4 border-t border-border pt-6">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-text"
                >
                  <Mail size={17} className="text-accent" aria-hidden />
                  {siteConfig.email}
                </a>
                <OpenChatButton variant="secondary" size="md" className="w-full border-white/10 bg-white/[0.04] hover:bg-white/[0.08]">
                  {tc("chatWithAssistant")}
                </OpenChatButton>
              </div>
            </div>

            {/* The Formula — most people who land here run a local business */}
            <div className="relative overflow-hidden rounded-[calc(var(--radius)*1.5)] border border-accent/30 bg-gradient-to-br from-accent/15 via-surface to-surface p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                  <Store size={20} aria-hidden />
                </span>
                <div>
                  <h2 className="text-lg font-semibold">{t("formulaTitle")}</h2>
                  <p className="mt-1.5 text-sm text-muted">
                    {t("formulaText")}
                  </p>
                  <Link
                    href="/formula"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline"
                  >
                    {t("formulaLink")}
                    <ArrowRight size={16} aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </Reveal>
      </div>
    </Section>
  );
}
