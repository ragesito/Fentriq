import { useTranslations } from "next-intl";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { CalButton } from "@/components/ui/CalButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Reveal } from "@/components/ui/Reveal";

export function CTASection() {
  const t = useTranslations("cta");

  return (
    <section className="relative overflow-hidden border-t border-border bg-bg py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 right-0 opacity-[0.06]"
      >
        <Image src="/brand/fentriq-mark.svg" alt="" width={420} height={420} />
      </div>

      <Container className="relative text-center">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1]">
            {t("title")}
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
            {t("subtitle")}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CalButton size="lg">{t("bookCall")}</CalButton>
            <WhatsAppButton size="lg">{t("whatsapp")}</WhatsAppButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
