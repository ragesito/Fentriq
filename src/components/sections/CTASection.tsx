import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { CalButton } from "@/components/ui/CalButton";
import { OpenChatButton } from "@/components/chat/OpenChatButton";
import { Reveal } from "@/components/ui/Reveal";

export function CTASection() {
  const t = useTranslations("cta");

  return (
    <section className="on-cream relative overflow-hidden border-t border-cream-2 bg-cream py-20 text-ink sm:py-28">
      {/* Soft brand light bleeding into the paper */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-[8%] h-80 w-80 rounded-full bg-accent/20 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-[6%] h-72 w-72 rounded-full bg-accent-2/15 blur-[100px]"
      />
      {/* Folded-band motif, echoing the logo */}
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className="pointer-events-none absolute -bottom-10 right-[4%] h-64 w-64 text-ink/[0.05]"
        fill="currentColor"
      >
        <path d="M20 150 L120 20 L160 20 L60 150 Z" />
        <path d="M70 150 L170 20 L200 20 L100 150 Z" opacity="0.6" />
      </svg>
      <div aria-hidden className="noise" />

      <Container className="relative text-center">
        <Reveal>
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
        </Reveal>
      </Container>
    </section>
  );
}
