import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/sections/LegalPage";
import { cookieDoc } from "@/content/legal";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: cookieDoc.title[locale as Locale],
    alternates: {
      canonical: locale === "it" ? "/cookie" : `/${locale}/cookie`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function CookiePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  return (
    <LegalPage
      doc={cookieDoc}
      locale={locale as Locale}
      updatedLabel={t("lastUpdated")}
    />
  );
}
