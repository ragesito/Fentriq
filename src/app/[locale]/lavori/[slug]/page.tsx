import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { caseStudies, getCaseStudy, getCaseStudies } from "@/content/work";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    caseStudies.map((c) => ({ locale, slug: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const loc = locale as Locale;
  const path = `/lavori/${slug}`;
  return {
    title: study.title,
    description: study.summary[loc],
    alternates: {
      canonical: locale === "it" ? path : `/${locale}${path}`,
      languages: { it: path, en: `/en${path}`, "x-default": path },
    },
    openGraph: {
      title: study.title,
      description: study.summary[loc],
      images: study.cover ? [{ url: study.cover }] : undefined,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const study = getCaseStudy(slug);
  if (!study) notFound();

  const t = await getTranslations("workPage");
  const tc = await getTranslations("common");

  const all = getCaseStudies();
  const idx = all.findIndex((c) => c.slug === slug);
  const next = all[(idx + 1) % all.length];

  const sections = [
    { key: "problem", body: study.sections.problem[loc] },
    { key: "solution", body: study.sections.solution[loc] },
    { key: "build", body: study.sections.build[loc] },
    { key: "result", body: study.sections.result[loc] },
  ] as const;

  return (
    <>
      <article className="pt-28">
        <Container className="max-w-3xl">
          <Link
            href="/lavori"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
          >
            <ArrowLeft size={16} aria-hidden />
            {tc("backToWork")}
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {study.badge?.[loc] ? <Badge accent>{study.badge[loc]}</Badge> : null}
            <Badge>{study.year}</Badge>
            {study.roles[loc].map((r) => (
              <Badge key={r}>{r}</Badge>
            ))}
          </div>

          <h1 className="mt-5 text-[clamp(2.5rem,6vw,4rem)] font-bold">
            {study.title}
          </h1>
          <p className="mt-4 text-lg text-muted sm:text-xl">
            {study.summary[loc]}
          </p>

          {(study.links.repo || study.links.live) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {study.links.live ? (
                <a
                  href={study.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm transition-colors hover:border-accent/60"
                >
                  <ExternalLink size={15} aria-hidden />
                  {tc("liveDemo")}
                </a>
              ) : null}
              {study.links.repo ? (
                <a
                  href={study.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm transition-colors hover:border-accent/60"
                >
                  <GithubIcon size={15} />
                  {tc("viewCode")}
                </a>
              ) : null}
            </div>
          )}
        </Container>

        {study.cover ? (
          <Container className="mt-12 max-w-4xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius)] border border-border">
              <Image
                src={study.cover}
                alt={study.title}
                fill
                priority
                sizes="(min-width:1024px) 56rem, 100vw"
                className="object-cover"
              />
            </div>
          </Container>
        ) : null}

        <Container className="mt-16 max-w-3xl">
          <div className="space-y-12">
            {sections.map(({ key, body }) => (
              <Reveal key={key}>
                <section>
                  <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                    {t(`sections.${key}`)}
                  </h2>
                  <p className="mt-3 text-lg leading-relaxed text-text/90">
                    {body}
                  </p>
                </section>
              </Reveal>
            ))}
          </div>

          {/* Next project */}
          <Link
            href={`/lavori/${next.slug}`}
            className="group mt-16 flex items-center justify-between gap-4 rounded-[var(--radius)] border border-border bg-surface p-6 transition-colors hover:border-accent/50"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
                {t("nextProject")}
              </p>
              <p className="mt-1 font-display text-xl font-semibold">
                {next.title}
              </p>
            </div>
            <ArrowRight
              size={22}
              aria-hidden
              className="text-muted transition-all group-hover:translate-x-1 group-hover:text-accent"
            />
          </Link>
        </Container>
      </article>

      <div className="mt-24" />
      <CTASection />
    </>
  );
}
