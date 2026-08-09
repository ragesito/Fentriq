import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const STEPS = ["discovery", "proposal", "development", "launch"] as const;

export function Process() {
  const t = useTranslations("process");

  return (
    <Section tone="light" containerClassName="relative">
      <span aria-hidden className="ghost-num absolute -top-6 right-0 hidden lg:block">
        03
      </span>
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

      <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {/* Connecting path (desktop) */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-[5px] hidden h-px lg:block"
        >
          <div className="h-full w-full bg-gradient-to-r from-accent-deep via-accent-deep/40 to-transparent" />
        </div>

        {STEPS.map((step, i) => (
          <Reveal as="li" key={step} delay={0.06 * i} className="relative">
            <div className="flex h-full flex-col">
              <span
                aria-hidden
                className="relative z-10 h-[11px] w-[11px] rounded-full bg-accent-deep ring-4 ring-cream"
              />
              <span className="mt-5 font-mono text-sm font-medium text-accent-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-lg font-semibold">
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
