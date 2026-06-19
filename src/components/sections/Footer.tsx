import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const ts = useTranslations("services");
  const year = 2026;

  const serviceLinks = ["web", "automation", "ai", "web3"] as const;

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" aria-label="Fentriq — home">
              <Logo variant="reverse" className="h-7 w-auto" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              {t("tagline")}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={`mailto:${siteConfig.email}`}
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-accent/60 hover:text-text"
              >
                <Mail size={17} aria-hidden />
              </a>
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-accent/60 hover:text-text"
              >
                <GithubIcon size={17} />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-accent/60 hover:text-text"
              >
                <LinkedinIcon size={17} />
              </a>
            </div>
          </div>

          {/* Services */}
          <nav aria-label={t("servicesTitle")}>
            <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
              {t("servicesTitle")}
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {serviceLinks.map((s) => (
                <li key={s}>
                  <Link
                    href="/#servizi"
                    className="text-muted transition-colors hover:text-text"
                  >
                    {ts(`items.${s}.title`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Site */}
          <nav aria-label={t("workTitle")}>
            <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
              {t("workTitle")}
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/lavori" className="text-muted transition-colors hover:text-text">
                  {tn("work")}
                </Link>
              </li>
              <li>
                <Link href="/contatti" className="text-muted transition-colors hover:text-text">
                  {tn("contact")}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label={t("legalTitle")}>
            <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
              {t("legalTitle")}
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-muted transition-colors hover:text-text">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/cookie" className="text-muted transition-colors hover:text-text">
                  {t("cookie")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center">
          <p>
            {siteConfig.vatNumber ? `${t("vat")} ${siteConfig.vatNumber} · ` : ""}
            © {year} {siteConfig.name}. {t("rights")}
          </p>
          <LocaleSwitcher />
        </div>
      </Container>
    </footer>
  );
}
