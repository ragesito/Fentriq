import { useTranslations } from "next-intl";
import { Gauge, Lock, User, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

const ITEMS: { key: string; icon: LucideIcon; highlight?: boolean }[] = [
  { key: "fast", icon: Gauge },
  { key: "ownership", icon: Lock },
  { key: "direct", icon: User },
  { key: "demo", icon: Workflow, highlight: true },
];

export function WhyUs() {
  const t = useTranslations("whyUs");

  return (
    <Section tone="surface">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <Reveal>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-semibold">
              {t("title")}
            </h2>
          </Reveal>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2">
          {ITEMS.map(({ key, icon: Icon, highlight }, i) => (
            <Reveal as="li" key={key} delay={0.05 * i}>
              <Card
                className={
                  highlight
                    ? "h-full border-accent/40 bg-gradient-to-br from-accent/10 to-transparent"
                    : "h-full"
                }
              >
                <Icon
                  size={22}
                  aria-hidden
                  className={highlight ? "text-accent-2" : "text-accent"}
                />
                <h3 className="mt-4 text-lg font-semibold">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {t(`items.${key}.description`)}
                </p>
              </Card>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
