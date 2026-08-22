"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { WorkTile } from "./WorkTile";
import type { CaseStudy } from "@/content/work";
import { cn } from "@/lib/cn";

type Filter = "all" | "client" | "concept" | "lab";

const FILTERS: Filter[] = ["all", "client", "concept", "lab"];

/**
 * The portfolio as something to browse, not scroll through: filter pills up
 * top, clients big, everything else in a dense grid. Tiles re-flow with a
 * layout animation when the filter changes.
 */
export function WorkGallery({
  clients,
  concepts,
  lab,
}: {
  clients: CaseStudy[];
  concepts: CaseStudy[];
  lab: CaseStudy[];
}) {
  const t = useTranslations("workPage");
  const [filter, setFilter] = useState<Filter>("all");

  const counts: Record<Filter, number> = {
    all: clients.length + concepts.length + lab.length,
    client: clients.length,
    concept: concepts.length,
    lab: lab.length,
  };
  const show = (k: Exclude<Filter, "all">) => filter === "all" || filter === k;

  return (
    <div>
      {/* Filters */}
      <div
        role="tablist"
        aria-label={t("filters.label")}
        className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap"
      >
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setFilter(f)}
              className={cn(
                "inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm transition-colors sm:h-9 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                active
                  ? "border-accent bg-accent text-on-accent"
                  : "border-border bg-surface text-muted hover:border-accent/50 hover:text-text",
              )}
            >
              {t(`filters.${f}`)}
              <span
                className={cn(
                  "rounded-full px-1.5 font-mono text-[11px] tabular-nums",
                  active ? "bg-white/20" : "bg-surface-2",
                )}
              >
                {counts[f]}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {/* Clients — big, with phone always visible */}
        {show("client") && clients.length ? (
          <motion.section
            key="clients"
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="mt-10"
          >
            <GroupHeading title={t("clientsTitle")} subtitle={t("clientsSubtitle")} />
            <div className="mt-5 grid gap-5">
              {clients.map((s) => (
                <WorkTile key={s.slug} study={s} wide />
              ))}
            </div>
          </motion.section>
        ) : null}

        {/* Concepts — dense grid */}
        {show("concept") && concepts.length ? (
          <motion.section
            key="concepts"
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="mt-14"
          >
            <GroupHeading title={t("conceptsTitle")} subtitle={t("conceptsSubtitle")} />
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {concepts.map((s) => (
                <WorkTile key={s.slug} study={s} />
              ))}
            </div>
          </motion.section>
        ) : null}

        {/* Lab */}
        {show("lab") && lab.length ? (
          <motion.section
            key="lab"
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="mt-14"
          >
            <GroupHeading title={t("labTitle")} subtitle={t("labSubtitle")} />
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {lab.map((s) => (
                <WorkTile key={s.slug} study={s} />
              ))}
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function GroupHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-5">
      <h2 className="shrink-0 text-[clamp(1.35rem,2.2vw,1.75rem)] font-semibold">{title}</h2>
      <p className="max-w-3xl text-sm text-muted">{subtitle}</p>
    </div>
  );
}
