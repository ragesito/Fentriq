import { cn } from "@/lib/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Apply the signature clipped top-right corner + hover facet. */
  faceted?: boolean;
  /** Lift + accent border on hover (use inside a `group`). */
  interactive?: boolean;
}

export function Card({
  faceted = false,
  interactive = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[var(--radius)] border border-border bg-surface p-6 transition-all duration-300",
        faceted && "faceted faceted-corner",
        interactive &&
          "hover:-translate-y-1 hover:border-accent/50 hover:bg-surface-2 hover:shadow-[var(--shadow-card)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
