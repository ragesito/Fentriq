import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Link } from "@/i18n/navigation";
import { getClientCases, getConceptCases } from "@/content/work";
import { WorkCard } from "./WorkCard";

export function Work() {
  const t = useTranslations("work");
  const clients = getClientCases();
  // Home shows a taste of the self-initiated builds; /lavori has them all.
  const concepts = getConceptCases().slice(0, 6);

  return (
    <Section id="lavori" tone="surface">
      <span aria-hidden className="ghost-num absolute -top-6 right-0 hidden lg:block">
        02
      </span>

      {/* Paying clients — the only ones we call clients. */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-semibold">
              {t("title")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-lg text-muted">{t("subtitle")}</p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <Link
            href="/lavori"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-2"
          >
            {t("viewAll")}
            <ArrowRight size={16} aria-hidden />
          </Link>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {clients.map((study, i) => (
          <Reveal key={study.slug} delay={0.05 * i}>
            <WorkCard study={study} />
          </Reveal>
        ))}
      </div>

      {/* Self-initiated builds — explicitly not clients. */}
      <div className="mt-20 max-w-2xl">
        <Reveal>
          <Eyebrow>{t("conceptsEyebrow")}</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 text-[clamp(1.7rem,3.2vw,2.4rem)] font-semibold">
            {t("conceptsTitle")}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-muted">{t("conceptsSubtitle")}</p>
        </Reveal>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {concepts.map((study, i) => (
          <Reveal key={study.slug} delay={0.04 * i}>
            <WorkCard study={study} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
