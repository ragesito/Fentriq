import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { CalButton } from "@/components/ui/CalButton";
import { Reveal } from "@/components/ui/Reveal";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const t = useTranslations("hero");
  const tc = useTranslations("common");

  return (
    <section className="relative overflow-hidden bg-bg pt-20 pb-24 sm:pt-28 sm:pb-32">
      {/* Ambient grid + glow */}
      <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-[40rem] w-[40rem] rounded-full bg-accent/10 blur-[120px]"
      />

      {/* Folded Band ambient mark, aligned right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-1/2 hidden -translate-y-1/2 opacity-[0.07] lg:block"
      >
        <Image
          src="/brand/fentriq-mark.svg"
          alt=""
          width={560}
          height={560}
          priority
        />
      </div>

      <Container className="relative">
        <div className="max-w-3xl">
          <Reveal>
            <p className="eyebrow flex items-center gap-2">
              <span aria-hidden className="inline-block h-px w-8 bg-accent/60" />
              {t("eyebrow")}
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05]">
              {t("titleBefore")}{" "}
              <span className="text-gradient">{t("titleHighlight")}</span>
              {t("titleAfter")}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
              {t("subtitle")}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CalButton size="lg">{tc("bookCall")}</CalButton>
              <Link
                href="/lavori"
                className={buttonClasses("secondary", "lg")}
              >
                {tc("viewWork")}
                <ArrowRight size={18} aria-hidden />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-10 font-mono text-xs uppercase tracking-[0.08em] text-muted/70">
              {t("stack")}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
