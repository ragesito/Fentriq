"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { StackChips } from "@/components/ui/StackChip";
import { trackEvent } from "@/lib/analytics";
import type { CaseStudy } from "@/content/work";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function WorkCard({
  study,
  featured = false,
}: {
  study: CaseStudy;
  featured?: boolean;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("work");
  const badge = study.badge?.[locale];

  return (
    <Link
      href={`/lavori/${study.slug}`}
      onClick={() => trackEvent("view_case", { slug: study.slug })}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[var(--shadow-card)]",
        featured && "lg:flex-row",
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/10] w-full overflow-hidden bg-surface-2",
          featured && "lg:aspect-auto lg:w-1/2",
        )}
      >
        {study.cover ? (
          <>
            <Image
              src={study.cover}
              alt={study.title}
              fill
              sizes={featured ? "(min-width:1024px) 50vw, 100vw" : "(min-width:640px) 50vw, 100vw"}
              className="object-cover object-top pt-7 transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {/* Slim browser-chrome bar to frame the screenshot */}
            <span className="absolute inset-x-0 top-0 flex h-7 items-center gap-1.5 border-b border-white/6 bg-[#0d0f14] px-3">
              <i className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]/80" />
              <i className="h-1.5 w-1.5 rounded-full bg-[#febc2e]/80" />
              <i className="h-1.5 w-1.5 rounded-full bg-[#28c840]/80" />
            </span>
          </>
        ) : (
          // Branded tile for cases without a publishable screenshot yet.
          <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,rgba(79,91,247,0.25),rgba(138,108,255,0.12)_55%,transparent)]">
            <span className="px-6 text-center font-display text-2xl font-semibold text-text/90">
              {study.title}
            </span>
            <span
              aria-hidden
              className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl"
            />
          </div>
        )}
        {badge ? (
          <div className="absolute left-4 top-4">
            <Badge accent>{badge}</Badge>
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col p-6",
          featured && "lg:justify-center lg:p-10",
        )}
      >
        <div className="flex items-center gap-3">
          <h3
            className={cn(
              "font-display font-semibold",
              featured ? "text-2xl sm:text-3xl" : "text-xl",
            )}
          >
            {study.title}
          </h3>
          {featured ? <Badge>{t("featured")}</Badge> : null}
          <ArrowUpRight
            size={18}
            aria-hidden
            className="ml-auto shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          />
        </div>
        <p className="mt-1 font-mono text-xs uppercase tracking-[0.06em] text-muted">
          {study.sector[locale]}
        </p>
        <p className="mt-3 text-muted">{study.summary[locale]}</p>
        <div className="mt-5">
          <StackChips items={study.roles[locale]} />
        </div>
      </div>
    </Link>
  );
}
