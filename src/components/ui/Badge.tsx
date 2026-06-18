import { cn } from "@/lib/cn";

export function Badge({
  children,
  className,
  accent = false,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em]",
        accent
          ? "bg-accent/15 text-accent ring-1 ring-inset ring-accent/30"
          : "bg-surface-2 text-muted ring-1 ring-inset ring-border",
        className,
      )}
    >
      {children}
    </span>
  );
}
