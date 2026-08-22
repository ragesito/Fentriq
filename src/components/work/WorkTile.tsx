"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { trackEvent } from "@/lib/analytics";
import type { CaseStudy } from "@/content/work";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/** Hostname shown in the faux browser bar (no scheme, no www). */
function hostOf(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

const KIND_DOT: Record<CaseStudy["kind"], string> = {
  client: "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]",
  concept: "bg-accent shadow-[0_0_10px_rgba(79,91,247,0.8)]",
  lab: "bg-accent-2 shadow-[0_0_10px_rgba(138,108,255,0.8)]",
};

/**
 * A project at a glance: real screenshot in browser chrome, the phone version
 * sliding in on hover, status, sector, what we built, and where it lives.
 * `wide` is the client variant — bigger, phone always visible, more room for
 * the facts that matter to a prospect.
 */
export function WorkTile({ study, wide = false }: { study: CaseStudy; wide?: boolean }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("workPage");
  const host = hostOf(study.links.live);
  const caseHref = `/lavori/${study.slug}`;

  return (
    <article
      className={cn(
        "group relative flex overflow-hidden rounded-[var(--radius)] border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[var(--shadow-card)]",
        wide ? "flex-col lg:flex-row" : "flex-col",
      )}
    >
      {/* Visual */}
      <div
        className={cn(
          "relative overflow-hidden bg-[#0d0f14]",
          wide ? "lg:w-[58%] lg:shrink-0" : "",
        )}
      >
        {/* Browser bar with the real address */}
        <div className="relative z-10 flex h-8 items-center gap-2 border-b border-white/6 bg-white/[0.03] px-3">
          <span aria-hidden className="flex gap-1.5">
            <i className="h-2 w-2 rounded-full bg-[#ff5f57]/80" />
            <i className="h-2 w-2 rounded-full bg-[#febc2e]/80" />
            <i className="h-2 w-2 rounded-full bg-[#28c840]/80" />
          </span>
          <span className="mx-auto max-w-[60%] truncate rounded-md bg-white/[0.05] px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-muted">
            {host ?? t("notPublished")}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-text">
            <i className={cn("h-1.5 w-1.5 rounded-full", KIND_DOT[study.kind])} />
            {t(`kindBadge.${study.kind}`)}
          </span>
        </div>

        <div className={cn("relative w-full", wide ? "aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[22rem]" : "aspect-[16/10]")}>
          {study.cover ? (
            <Image
              src={study.cover}
              alt={study.title}
              fill
              sizes={wide ? "(min-width:1024px) 45vw, 100vw" : "(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw"}
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,rgba(79,91,247,0.25),rgba(138,108,255,0.12)_55%,transparent)]">
              <span className="px-6 text-center font-display text-2xl font-semibold text-text/90">
                {study.title}
              </span>
            </div>
          )}

          {/* Phone version: always there on wide tiles, slides in on hover elsewhere */}
          {study.mobile ? (
            <div
              className={cn(
                "absolute bottom-0 right-4 w-[24%] max-w-[120px] transition-all duration-500 ease-out",
                wide
                  ? "translate-y-[8%] lg:right-8 lg:w-[26%] lg:max-w-[150px]"
                  : "translate-y-[110%] opacity-0 group-hover:translate-y-[10%] group-hover:opacity-100 group-focus-within:translate-y-[10%] group-focus-within:opacity-100",
              )}
            >
              <PhoneFrame src={study.mobile} alt="" sizes="150px" />
            </div>
          ) : null}

        </div>
      </div>

      {/* Facts */}
      <div className={cn("flex flex-1 flex-col p-5", wide && "lg:p-8")}>
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
          {study.sector[locale]}
        </p>
        <h3 className={cn("mt-1.5 font-display font-semibold", wide ? "text-2xl sm:text-3xl" : "text-lg")}>
          <Link
            href={caseHref}
            onClick={() => trackEvent("view_case", { slug: study.slug })}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {study.title}
          </Link>
        </h3>
        <p className={cn("mt-2 text-sm text-muted", wide ? "text-base" : "line-clamp-2")}>
          {study.summary[locale]}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {study.roles[locale].slice(0, wide ? 4 : 3).map((r) => (
            <li
              key={r}
              className="rounded-md border border-border bg-surface-2/60 px-2 py-0.5 font-mono text-[11px] text-muted"
            >
              {r}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm">
          <span className="inline-flex items-center gap-1.5 font-medium text-text transition-colors group-hover:text-accent">
            {t("viewCase")}
            <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
          </span>
          {study.links.live ? (
            <a
              href={study.links.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("open_live", { slug: study.slug })}
              className="relative z-10 inline-flex items-center gap-1 text-muted transition-colors hover:text-accent"
            >
              {study.kind === "client" ? t("openSite") : t("openPreview")}
              <ArrowUpRight size={14} aria-hidden />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
