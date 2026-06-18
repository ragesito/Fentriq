import { cn } from "@/lib/cn";
import { Container } from "./Container";

type Tone = "default" | "surface" | "light";

const toneStyles: Record<Tone, string> = {
  default: "bg-bg text-text",
  surface: "bg-surface text-text",
  light: "bg-bg-light text-text-on-light",
};

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: Tone;
  /** Render without the inner Container (for full-bleed content). */
  bleed?: boolean;
  containerClassName?: string;
}

export function Section({
  tone = "default",
  bleed = false,
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "relative scroll-mt-24 py-20 sm:py-28",
        toneStyles[tone],
        className,
      )}
      {...props}
    >
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}
