"use client";

import { Card } from "./Card";
import { cn } from "@/lib/cn";

type SpotlightCardProps = React.ComponentProps<typeof Card>;

/** Card whose glow follows the cursor (see `.spotlight` in globals.css). */
export function SpotlightCard({ className, ...props }: SpotlightCardProps) {
  return (
    <Card
      {...props}
      className={cn("spotlight", className)}
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    />
  );
}
