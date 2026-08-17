import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Link } from "@/i18n/navigation";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { getCaseStudies, type CaseStudy } from "@/content/work";
import type { Locale } from "@/i18n/routing";

/**
 * Home showcase: two full-bleed auto-scrolling rows of real screenshots of
 * client sites, each linking to its case study. Pure CSS marquee (see
 * globals.css), paused on hover and disabled for prefers-reduced-motion.
 */
export function Showcase() {
  const t = useTranslations("showcase");
  const locale = useLocale() as Locale;

  // Everything we've built, clients and self-initiated alike — the strip is
  // about the craft; who is a client is stated in the Work section.
  const shots = getCaseStudies().filter((s) => s.cover);
  const mid = Math.ceil(shots.length / 2);
  const rows: [CaseStudy[], CaseStudy[]] = [shots.slice(0, mid), shots.slice(mid)];

  return (
    <Section
      id="showreel"
      tone="light"
      bleed
      className="pt-16 pb-20 sm:pt-20 sm:pb-24"
    >
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal>
              <Eyebrow>{t("eyebrow")}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 text-[clamp(1.8rem,3.6vw,2.75rem)] font-semibold">
                {t("title")}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-muted">{t("subtitle")}</p>
          </Reveal>
        </div>
      </Container>

      {/* Full-bleed rows — the screenshots run edge to edge. */}
      <Reveal delay={0.05}>
        <div className="space-y-5">
          {rows.map((row, i) => (
            <div key={i} className="marquee relative overflow-hidden">
              <div
                className={
                  i % 2 === 0
                    ? "marquee-track flex w-max gap-5"
                    : "marquee-track marquee-reverse flex w-max gap-5"
                }
              >
                {[false, true].map((clone) => (
                  <div
                    key={String(clone)}
                    aria-hidden={clone || undefined}
                    className="flex shrink-0 gap-5 pr-5"
                  >
                    {row.map((study) => (
                      <Link
                        key={study.slug}
                        href={`/lavori/${study.slug}`}
                        tabIndex={clone ? -1 : undefined}
                        className="group block w-[300px] shrink-0 transition-transform duration-300 hover:-translate-y-1 sm:w-[400px]"
                      >
                        <div className="relative pb-6 pr-6">
                          <BrowserFrame label={study.title}>
                            <div className="relative aspect-[16/10]">
                              <Image
                                src={study.cover!}
                                alt={study.title}
                                fill
                                sizes="400px"
                                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3.5 pt-8">
                                <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-white/75">
                                  {study.sector[locale]}
                                </p>
                              </div>
                            </div>
                          </BrowserFrame>
                          {/* Same site on a phone — responsive, at a glance. */}
                          {study.mobile ? (
                            <PhoneFrame
                              src={study.mobile}
                              className="absolute bottom-0 right-0 w-[26%] transition-transform duration-500 group-hover:-translate-y-1"
                              sizes="110px"
                            />
                          ) : null}
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>

              {/* Edge fade into the paper */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream to-transparent sm:w-32"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cream to-transparent sm:w-32"
              />
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
