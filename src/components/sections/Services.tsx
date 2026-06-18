import { useTranslations } from "next-intl";
import { Code2, Workflow, BrainCircuit, Boxes, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Link } from "@/i18n/navigation";

const SERVICES: { key: string; icon: LucideIcon }[] = [
  { key: "web", icon: Code2 },
  { key: "automation", icon: Workflow },
  { key: "ai", icon: BrainCircuit },
  { key: "web3", icon: Boxes },
];

export function Services() {
  const t = useTranslations("services");
  const tc = useTranslations("common");

  return (
    <Section id="servizi" tone="default">
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

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map(({ key, icon: Icon }, i) => (
          <Reveal as="li" key={key} delay={0.05 * i}>
            <Card faceted interactive className="group h-full">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/12 text-accent ring-1 ring-inset ring-accent/20">
                <Icon size={22} aria-hidden />
              </div>
              <h3 className="mt-5 text-lg font-semibold">
                {t(`items.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t(`items.${key}.description`)}
              </p>
              <Link
                href="/contatti"
                className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-2"
              >
                {tc("discover")}
                <ArrowRight size={15} aria-hidden />
              </Link>
            </Card>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
