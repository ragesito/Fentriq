import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Calendar, Mail } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { CalButton } from "@/components/ui/CalButton";
import { ContactForm } from "@/components/sections/ContactForm";
import { OpenChatButton } from "@/components/chat/OpenChatButton";
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
    <Section tone="default" className="pt-28">
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

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Form */}
        <Reveal>
          <ContactForm />
        </Reveal>

        {/* Booking + direct channels */}
        <Reveal delay={0.05}>
          <aside className="lg:sticky lg:top-28">
            <div className="rounded-[var(--radius)] border border-border bg-surface p-7">
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
                <OpenChatButton variant="secondary" size="md" className="w-full">
                  {tc("chatWithAssistant")}
                </OpenChatButton>
              </div>
            </div>
          </aside>
        </Reveal>
      </div>
    </Section>
  );
}
