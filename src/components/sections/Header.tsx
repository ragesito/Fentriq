"use client";

import { useEffect, useState } from "react";
import { Mail, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { CalButton } from "@/components/ui/CalButton";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { XIcon, InstagramIcon } from "@/components/ui/BrandIcons";
import { navItems, siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

export function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
          scrolled
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
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-text"
            >
              {t(item.key)}
            </Link>
          ))}
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

      {/* Mobile full-screen menu */}
      {open && (
        <div className="fixed inset-0 top-16 z-40 flex flex-col bg-bg md:hidden">
          <Container className="flex flex-1 flex-col overflow-y-auto py-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 font-display text-2xl font-semibold"
              >
                {t(item.key)}
              </Link>
            ))}

            {/* Bottom block: socials + language on one row, CTA under them.
                Extra bottom padding keeps clear of the floating chat bubble. */}
            <div className="mt-auto pb-24 pt-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    aria-label="Email"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-accent/60 hover:text-text"
                  >
                    <Mail size={18} aria-hidden />
                  </a>
                  <a
                    href={siteConfig.social.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-accent/60 hover:text-text"
                  >
                    <XIcon size={17} />
                  </a>
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-accent/60 hover:text-text"
                  >
                    <InstagramIcon size={18} />
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
      )}
    </header>
  );
}
