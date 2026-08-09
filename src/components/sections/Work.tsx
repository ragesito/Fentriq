import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Link } from "@/i18n/navigation";
import { getClientCases } from "@/content/work";
import { WorkCard } from "./WorkCard";

export function Work() {
  const t = useTranslations("work");
  const studies = getClientCases();
  const featured = studies.find((s) => s.featured) ?? studies[0];
  // Home shows the featured case + six more; the full list lives at /lavori.
  const rest = studies.filter((s) => s.slug !== featured.slug).slice(0, 6);

  return (
    <Section id="lavori" tone="surface" containerClassName="relative">
      <span aria-hidden className="ghost-num absolute -top-6 right-0 hidden lg:block">
        02
      </span>
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

      <div className="mt-12 space-y-5">
        <Reveal>
          <WorkCard study={featured} featured />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {rest.map((study, i) => (
            <Reveal key={study.slug} delay={0.05 * i}>
              <WorkCard study={study} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
