import { useTranslations } from "next-intl";
import { Store, Package, Repeat, Compass, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Reveal } from "@/components/ui/Reveal";
import { CalButton } from "@/components/ui/CalButton";
import { Link } from "@/i18n/navigation";

const ITEMS: { key: string; icon: LucideIcon }[] = [
  { key: "local", icon: Store },
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

      <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ key, icon: Icon }, i) => (
          <Reveal as="li" key={key} delay={0.05 * i}>
            <SpotlightCard
              faceted
              interactive
              className={
                key === "local" ? "gradient-ring group h-full" : "group h-full"
              }
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/12 text-accent ring-1 ring-inset ring-accent/20 transition-transform duration-300 group-hover:scale-110">
                <Icon size={22} aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-semibold">
                {t(`items.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t(`items.${key}.description`)}
              </p>
              {key === "local" ? (
                <Link
                  href="/formula"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-2"
                >
                  {t("items.local.cta")}
                  <ArrowRight size={15} aria-hidden />
                </Link>
              ) : null}
            </SpotlightCard>
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
