import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";

const KEYS = ["cost", "time", "where", "ownership", "scope"] as const;

export function FAQ() {
  const t = useTranslations("faq");
  const items = KEYS.map((k) => ({
    q: t(`items.${k}.q`),
    a: t(`items.${k}.a`),
  }));

  return (
    <Section tone="surface">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Reveal>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-semibold">
              {t("title")}
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.05}>
          <Accordion items={items} />
        </Reveal>
      </div>
    </Section>
  );
}
