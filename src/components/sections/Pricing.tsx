import { useTranslations } from "next-intl";
import { Package, Repeat, Compass } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { CalButton } from "@/components/ui/CalButton";

const ITEMS: { key: string; icon: LucideIcon }[] = [
  { key: "project", icon: Package },
  { key: "retainer", icon: Repeat },
  { key: "consulting", icon: Compass },
];

export function Pricing() {
  const t = useTranslations("pricing");

  return (
    <Section tone="default">
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

      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {ITEMS.map(({ key, icon: Icon }, i) => (
          <Reveal as="li" key={key} delay={0.05 * i}>
            <Card faceted interactive className="group h-full">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/12 text-accent ring-1 ring-inset ring-accent/20">
                <Icon size={22} aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-semibold">
                {t(`items.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t(`items.${key}.description`)}
              </p>
            </Card>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={0.1}>
        <div className="mt-10">
          <CalButton size="lg">{t("cta")}</CalButton>
        </div>
      </Reveal>
    </Section>
  );
}
