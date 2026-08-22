"use client";

import { useEffect, useState } from "react";
import { Mail, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { CalButton } from "@/components/ui/CalButton";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { XIcon, InstagramIcon, FacebookIcon } from "@/components/ui/BrandIcons";
import { navItems, siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

export function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => {
    const base = href.split("#")[0] || "/";
    return base === "/" ? false : pathname === base || pathname.startsWith(`${base}/`);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40">
      {/* The backdrop-blur lives on this inner bar only — putting it on the
          <header> would make it the containing block for the fixed mobile
          menu below, collapsing the menu's height when scrolled. */}
      <div
        className={cn(
          "border-b transition-colors duration-300",
          scrolled || open
            ? "border-border bg-bg/80 backdrop-blur-md"
            : "border-transparent bg-transparent",
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Fentriq — home"
          className="flex items-center"
          onClick={() => setOpen(false)}
        >
          <Logo variant="reverse" priority className="h-7 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  // A brand-gradient hairline sweeps in from the left on hover and
                  // retreats to the right on leave; the active page keeps it lit.
                  "relative py-1 text-sm font-semibold transition-colors duration-200",
                  "after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-gradient-to-r after:from-accent after:to-accent-2 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)]",
                  active
                    ? "text-text after:origin-left after:scale-x-100 after:shadow-[0_0_12px_rgba(79,91,247,0.8)]"
                    : "text-muted after:origin-right after:scale-x-0 hover:text-text hover:after:origin-left hover:after:scale-x-100",
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher />
          <CalButton size="md">{t("bookCall")}</CalButton>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md text-text md:hidden"
          aria-label={open ? t("close") : t("openMenu")}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        </Container>
      </div>

      {/* Mobile full-screen menu. The glass is its own empty layer (painted once,
          never invalidated); the links stagger in with compositor-only CSS
          animations, so nothing forces the blur to recompute mid-animation. */}
      {open ? (
        <div className="fixed inset-0 top-16 z-40 flex flex-col md:hidden">
          <div aria-hidden className="absolute inset-0 bg-bg/55 backdrop-blur-xl" />
          <Container className="relative flex flex-1 flex-col overflow-y-auto py-8">
            {navItems.map((item, i) => (
              <div key={item.key} className="menu-in" style={{ "--i": i } as React.CSSProperties}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-white/10 py-4 font-display text-2xl font-semibold"
                >
                  {t(item.key)}
                </Link>
              </div>
            ))}

            {/* Bottom block: socials + language on one row, CTA under them.
                Extra bottom padding keeps clear of the floating chat bubble. */}
            <div
              className="menu-in mt-auto pb-24 pt-10"
              style={{ "--i": navItems.length } as React.CSSProperties}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    aria-label="Email"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-muted transition-colors hover:border-accent/60 hover:text-text"
                  >
                    <Mail size={18} aria-hidden />
                  </a>
                  <a
                    href={siteConfig.social.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-muted transition-colors hover:border-accent/60 hover:text-text"
                  >
                    <XIcon size={17} />
                  </a>
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-muted transition-colors hover:border-accent/60 hover:text-text"
                  >
                    <InstagramIcon size={18} />
                  </a>
                  <a
                    href={siteConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-muted transition-colors hover:border-accent/60 hover:text-text"
                  >
                    <FacebookIcon size={18} />
                  </a>
                </div>
                <LocaleSwitcher />
              </div>
              <CalButton size="lg" className="mt-5 w-full">
                {t("bookCall")}
              </CalButton>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
