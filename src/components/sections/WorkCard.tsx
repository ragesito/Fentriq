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
          <Image
            src={study.cover}
            alt={study.title}
            fill
            sizes={featured ? "(min-width:1024px) 50vw, 100vw" : "(min-width:640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
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
            className="ml-auto text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          />
        </div>
        <p className="mt-3 text-muted">{study.summary[locale]}</p>
        <div className="mt-5">
          <StackChips items={study.roles[locale]} />
        </div>
      </div>
    </Link>
  );
}
