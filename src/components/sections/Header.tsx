"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { CalButton } from "@/components/ui/CalButton";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { navItems } from "@/config/site";
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
        <div className="fixed inset-0 top-16 z-40 bg-bg md:hidden">
          <Container className="flex flex-col gap-2 py-8">
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
            <div className="mt-6 flex items-center justify-between">
              <LocaleSwitcher />
            </div>
            <div className="mt-2">
              <CalButton size="lg" className="w-full">
                {t("bookCall")}
              </CalButton>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
