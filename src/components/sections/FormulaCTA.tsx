import { useTranslations } from "next-intl";
import { ArrowRight, Store, CalendarCheck, Bot } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { CalButton } from "@/components/ui/CalButton";
import { buttonClasses } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const TIERS: { key: "base" | "pro" | "max"; icon: LucideIcon }[] = [
  { key: "base", icon: Store },
  { key: "pro", icon: CalendarCheck },
  { key: "max", icon: Bot },
];

/**
 * Home pitch for the Formula: the pay-monthly, own-it-in-nine-months offer
 * for local businesses. Cream paper block; the three tiers sit on a single
 * ledger card (names, prices and totals come from the `formula` namespace so
 * they can never drift from /formula).
 */
export function FormulaCTA() {
  const t = useTranslations("formulaCta");
  const f = useTranslations("formula");

  return (
    <Section
      id="formula"
      tone="light"
      className="overflow-hidden"
      containerClassName="relative"
    >
      {/* Soft brand light on the paper, like the closing CTA */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-6%] h-96 w-96 rounded-full bg-accent/15 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[-4%] h-80 w-80 rounded-full bg-accent-2/12 blur-[100px]"
      />
      <div aria-hidden className="noise" />

      <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
        {/* Pitch */}
        <div className="max-w-xl">
          <Reveal>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-[clamp(2rem,4.2vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.02em]">
              {t("title")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {t("subtitle")}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/formula" className={buttonClasses("primary", "lg")}>
                {t("cta")}
                <ArrowRight size={18} aria-hidden />
              </Link>
              <CalButton
                size="lg"
                variant="secondary"
                className="border-ink/15 bg-white/60 text-ink hover:border-accent-deep/50 hover:bg-white"
              >
                {t("ctaCall")}
              </CalButton>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
              {f("badge")}
            </p>
          </Reveal>
        </div>

        {/* Ledger: the three formulas, one line each */}
        <Reveal delay={0.1}>
          <div
            className="group relative rounded-[var(--radius)] bg-white/70 shadow-[0_24px_60px_-28px_rgba(21,23,28,0.45)] ring-1 ring-ink/10"
            style={
              { "--tier-color": "var(--color-accent-deep)" } as React.CSSProperties
            }
          >
            <p className="px-5 pt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted sm:px-6">
              {t("ledgerLabel")}
            </p>

            <ul className="mt-3 divide-y divide-dashed divide-ink/15">
              {TIERS.map(({ key, icon: Icon }) => {
                const pro = key === "pro";
                const max = key === "max";
                return (
                  <li key={key}>
                    <Link
                      href="/formula#formule"
                      className="group/row flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white sm:px-6"
                    >
                      <span
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset transition-transform duration-300 group-hover/row:scale-110",
                          max
                            ? "bg-accent-2/15 text-accent-2 ring-accent-2/25"
                            : "bg-accent-deep/10 text-accent-deep ring-accent-deep/20",
                        )}
                      >
                        <Icon size={20} aria-hidden />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-semibold">
                            {f(`tiers.${key}.name`)}
                          </span>
                          {pro || max ? (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] ring-1 ring-inset",
                                max
                                  ? "bg-accent-2/12 text-accent-2 ring-accent-2/30"
                                  : "bg-accent-deep/10 text-accent-deep ring-accent-deep/25",
                              )}
                            >
                              {f(`tiers.${key}.badge`)}
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-0.5 block text-sm text-muted">
                          {f(`tiers.${key}.tagline`)}
                        </span>
                      </span>

                      <span className="shrink-0 text-right">
                        <span className="block text-2xl font-bold leading-none tracking-[-0.03em]">
                          {f(`tiers.${key}.price`)}
                          <span className="ml-1 text-xs font-medium tracking-normal text-muted">
                            {f("tiers.monthLabel")}
                          </span>
                        </span>
                        <span className="mt-1.5 block font-mono text-[11px] text-muted">
                          {f(`tiers.${key}.total`)} ·{" "}
                          <span className="font-semibold uppercase tracking-[0.1em] text-accent-deep">
                            {f("tiers.ownedLabel")}
                          </span>
                        </span>
                      </span>

                      <ArrowRight
                        size={16}
                        aria-hidden
                        className="hidden shrink-0 text-accent-deep opacity-0 transition-all duration-300 group-hover/row:translate-x-0.5 group-hover/row:opacity-100 sm:block"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Nine months to ownership — fills in on hover */}
            <div className="border-t border-dashed border-ink/15 px-5 pb-5 pt-4 sm:px-6">
              <div className="flex gap-1">
                {Array.from({ length: 9 }, (_, m) => (
                  <span
                    key={m}
                    className={cn(
                      "tier-seg h-1.5 flex-1 rounded-sm",
                      m === 8 && "tier-seg-owned",
                    )}
                    style={{ "--i": m } as React.CSSProperties}
                  />
                ))}
              </div>
              <p className="mt-2.5 font-mono text-[11px] text-muted">
                {t("footer")}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
