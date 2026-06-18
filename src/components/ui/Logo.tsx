import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Renders the Fentriq lockup. The site is dark, so `reverse` is the default.
 * SVGs ship text-as-curves, so no font dependency.
 */
export function Logo({
  variant = "reverse",
  className,
  priority = false,
}: {
  variant?: "reverse" | "primary" | "stacked" | "mark";
  className?: string;
  priority?: boolean;
}) {
  const src = {
    reverse: "/brand/fentriq-reverse.svg",
    primary: "/brand/fentriq-primary.svg",
    stacked: "/brand/fentriq-stacked.svg",
    mark: "/brand/fentriq-mark.svg",
  }[variant];

  const dims =
    variant === "mark"
      ? { width: 40, height: 40 }
      : variant === "stacked"
        ? { width: 160, height: 120 }
        : { width: 150, height: 36 };

  return (
    <Image
      src={src}
      alt="Fentriq"
      width={dims.width}
      height={dims.height}
      priority={priority}
      className={cn("h-auto w-auto select-none", className)}
    />
  );
}
