import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { CalButton } from "@/components/ui/CalButton";
import { Reveal } from "@/components/ui/Reveal";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { getClientCases } from "@/content/work";
import { ArrowRight } from "lucide-react";

/** Real screenshots stacked in the hero — evidence before words. */
const COLLAGE = [
  {
    slug: "matchmood",
    cover: "/work/matchmood.jpg",
    label: "matchmood.dev",
    className:
      "absolute right-0 top-0 w-[58%] [--tilt:2.5deg] [animation-delay:-2s]",
  },
  {
    slug: "zampami",
    cover: "/work/zampami.jpg",
    label: "Zampami · Torvaianica",
    className:
      "absolute left-0 top-24 w-[52%] [--tilt:-3deg] [animation-delay:-5s]",
  },
  {
    slug: "schiano",
    cover: "/work/schiano.jpg",
    label: "schiano.vercel.app",
    className:
      "absolute bottom-0 right-6 w-[72%] [--tilt:1.5deg]",
  },
];

export function Hero() {
  const t = useTranslations("hero");
  const tc = useTranslations("common");
  const clientCount = getClientCases().length;
  const chips = t("stack").split("·").map((s) => s.trim()).filter(Boolean);

  return (
    <section className="relative overflow-hidden bg-bg pt-20 pb-24 sm:pt-28 sm:pb-32">
      {/* Ambient grid, glows, sweeping beam and grain */}
      <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="animate-glow-pulse pointer-events-none absolute -top-40 right-0 h-[40rem] w-[40rem] rounded-full bg-accent/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="animate-glow-pulse pointer-events-none absolute -bottom-48 -left-32 h-[34rem] w-[34rem] rounded-full bg-accent-2/10 blur-[130px] [animation-delay:-4s]"
      />
      <div
        aria-hidden
        className="animate-beam pointer-events-none absolute -top-1/4 left-1/3 h-[150%] w-40 bg-gradient-to-b from-transparent via-accent/10 to-transparent blur-2xl"
      />
      <div aria-hidden className="noise" />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <p className="eyebrow flex items-center gap-2">
                <span aria-hidden className="inline-block h-px w-8 bg-accent/60" />
                {t("eyebrow")}
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.25rem)] font-bold leading-[1.04] tracking-[-0.03em]">
                {t("titleBefore")}{" "}
                <span className="text-gradient-animated">
                  {t("titleHighlight")}
                </span>
                {t("titleAfter")}
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
                {t("subtitle")}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <CalButton size="lg">{tc("bookCall")}</CalButton>
                <Link href="/lavori" className={buttonClasses("secondary", "lg")}>
                  {tc("viewWork")}
                  <ArrowRight size={18} aria-hidden />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-text">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {t("proof", { count: clientCount })}
                </span>
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-border bg-surface/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Collage of real client screenshots */}
          <Reveal delay={0.15} className="relative hidden lg:block">
            <div className="relative h-[460px] xl:h-[520px]">
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[100px]"
              />
              {COLLAGE.map((item) => (
                <Link
                  key={item.slug}
                  href={`/lavori/${item.slug}`}
                  className={`animate-collage block transition-transform duration-300 hover:z-10 hover:scale-[1.03] ${item.className}`}
                >
                  <BrowserFrame label={item.label}>
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={item.cover}
                        alt=""
                        fill
                        sizes="420px"
                        priority={item.slug === "schiano"}
                        className="object-cover object-top"
                      />
                    </div>
                  </BrowserFrame>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
