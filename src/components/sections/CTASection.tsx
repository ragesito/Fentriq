import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { CalButton } from "@/components/ui/CalButton";
import { OpenChatButton } from "@/components/chat/OpenChatButton";
import { Reveal } from "@/components/ui/Reveal";

export function CTASection() {
  const t = useTranslations("cta");

  return (
    <section className="relative border-t border-border bg-bg py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="on-cream relative overflow-hidden rounded-[calc(var(--radius)*2)] bg-cream px-6 py-16 text-center text-ink shadow-[0_40px_100px_-40px_rgba(0,0,0,0.8)] sm:px-12 sm:py-20">
            {/* Soft brand light bleeding into the paper */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-accent/20 blur-[100px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-accent-2/15 blur-[100px]"
            />
            {/* Folded-band motif, echoing the logo */}
            <svg
              aria-hidden
              viewBox="0 0 200 200"
              className="pointer-events-none absolute -bottom-10 -right-6 h-64 w-64 text-ink/[0.05]"
              fill="currentColor"
            >
              <path d="M20 150 L120 20 L160 20 L60 150 Z" />
              <path d="M70 150 L170 20 L200 20 L100 150 Z" opacity="0.6" />
            </svg>
            <div aria-hidden className="noise" />

            <div className="relative">
              <h2 className="mx-auto max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.02em]">
                {t("title")}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
                {t("subtitle")}
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CalButton size="lg">{t("bookCall")}</CalButton>
                <OpenChatButton
                  size="lg"
                  className="border-ink/15 bg-white/60 text-ink hover:border-accent-deep/50 hover:bg-white"
                >
                  {t("chat")}
                </OpenChatButton>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
