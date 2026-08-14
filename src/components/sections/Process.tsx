import { useTranslations } from "next-intl";
import { PhoneCall, FileText, Code2, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const STEPS: { key: string; icon: LucideIcon }[] = [
  { key: "discovery", icon: PhoneCall },
  { key: "proposal", icon: FileText },
  { key: "development", icon: Code2 },
  { key: "launch", icon: Rocket },
];

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

      <ol className="relative mt-16 grid gap-12 lg:grid-cols-4 lg:gap-8">
        {/* Route line: horizontal through the icon stations (desktop),
            vertical down their spine (mobile). */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-accent-deep/60 via-ink/20 to-ink/5 lg:block"
        />
        <div
          aria-hidden
          className="absolute bottom-6 left-7 top-2 w-px bg-gradient-to-b from-accent-deep/60 via-ink/20 to-ink/5 lg:hidden"
        />

        {STEPS.map(({ key, icon: Icon }, i) => {
          const last = i === STEPS.length - 1;
          return (
            <Reveal as="li" key={key} delay={0.07 * i} className="relative pl-20 lg:pl-0">
              {/* Icon station, sitting on the line */}
              <div className="absolute left-0 top-0 lg:relative lg:left-auto lg:top-auto">
                <div
                  className={
                    last
                      ? "relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-deep text-white shadow-[0_10px_30px_-8px_rgba(59,69,214,0.55)]"
                      : "relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-accent-deep shadow-[0_10px_30px_-12px_rgba(21,23,28,0.35)] ring-1 ring-ink/10"
                  }
                >
                  <Icon size={24} aria-hidden />
                </div>
              </div>

              <div className="lg:mt-7">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm font-semibold text-accent-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-semibold">{t(`steps.${key}.title`)}</h3>
                </div>
                <p className="mt-2.5 max-w-xs text-[15px] leading-relaxed text-muted">
                  {t(`steps.${key}.description`)}
                </p>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
