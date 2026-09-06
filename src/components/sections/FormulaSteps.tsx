"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, TrendingUp, Key, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type TierKey = "base" | "pro" | "max";
export interface StepCopy {
  title: string;
  description: string;
}
export interface TierSteps {
  key: TierKey;
  label: string;
  steps: StepCopy[];
}

const ICONS: LucideIcon[] = [Sparkles, TrendingUp, Key, Wrench];
/** Step 3 (ownership) is the one the whole Formula is about — it gets the filled tile. */
const OWNED_STEP = 2;

/**
 * "Come funziona" with one switch: the four steps stay the same shape, the
 * numbers inside change with the chosen formula. Strings arrive already
 * translated from the server page.
 */
export function FormulaSteps({ tiers, switchLabel }: { tiers: TierSteps[]; switchLabel: string }) {
  const [active, setActive] = useState<TierKey>("base");
  const reduce = useReducedMotion();

  return (
    <div className="mt-12">
      <div
        role="tablist"
        aria-label={switchLabel}
        className="inline-flex rounded-full bg-white/70 p-1 shadow-[0_10px_30px_-16px_rgba(21,23,28,0.3)] ring-1 ring-ink/10"
      >
        {tiers.map((x) => {
          const on = x.key === active;
          return (
            <button
              key={x.key}
              role="tab"
              type="button"
              aria-selected={on}
              onClick={() => setActive(x.key)}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-5",
                on ? "text-white" : "text-ink-muted hover:text-ink",
              )}
            >
              {on ? (
                <motion.span
                  layoutId="formula-steps-pill"
                  className="absolute inset-0 rounded-full bg-accent-deep shadow-[0_10px_30px_-8px_rgba(59,69,214,0.55)]"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              ) : null}
              <span className="relative">{x.label}</span>
            </button>
          );
        })}
      </div>

      {/* All three variants share one grid cell, so the block is always as
          tall as the tallest one and never jumps when the switch changes. */}
      <div className="mt-12 grid">
        {tiers.map((x) => {
          const on = x.key === active;
          return (
            <motion.ol
              key={x.key}
              aria-hidden={!on}
              initial={false}
              animate={{ opacity: on ? 1 : 0, y: on || reduce ? 0 : 6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "relative grid gap-12 [grid-area:1/1] lg:grid-cols-4 lg:gap-8",
                !on && "pointer-events-none",
              )}
            >
              <div
                aria-hidden
                className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-accent-deep/60 via-ink/20 to-ink/5 lg:block"
              />
              <div
                aria-hidden
                className="absolute bottom-6 left-7 top-2 w-px bg-gradient-to-b from-accent-deep/60 via-ink/20 to-ink/5 lg:hidden"
              />
              {x.steps.map((step, i) => {
                const Icon = ICONS[i];
                const owned = i === OWNED_STEP;
                return (
                  <li key={i} className="relative pl-20 lg:pl-0">
                    <div className="absolute left-0 top-0 lg:relative lg:left-auto lg:top-auto">
                      <div
                        className={
                          owned
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
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                      <p className="mt-2.5 max-w-xs text-[15px] leading-relaxed text-muted">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </motion.ol>
          );
        })}
      </div>
    </div>
  );
}
