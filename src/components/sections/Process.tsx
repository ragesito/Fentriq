import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const STEPS = ["discovery", "proposal", "development", "launch"] as const;

export function Process() {
  const t = useTranslations("process");

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

      <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <Reveal as="li" key={step} delay={0.05 * i} className="bg-surface">
            <div className="flex h-full flex-col p-6">
              <span className="font-mono text-sm font-medium text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-semibold">
                {t(`steps.${step}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t(`steps.${step}.description`)}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
