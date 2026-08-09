import { cn } from "@/lib/cn";

/**
 * Faux browser chrome around real product screenshots — three dots and a
 * mono URL/label pill. Purely decorative framing that signals "this is a
 * real, live interface", used in the hero collage, marquee and work cards.
 */
export function BrowserFrame({
  label,
  className,
  children,
}: {
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[calc(var(--radius)-4px)] border border-white/8 bg-[#0d0f14] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/6 bg-white/[0.03] px-3.5 py-2">
        <span aria-hidden className="flex gap-1.5">
          <i className="h-2 w-2 rounded-full bg-[#ff5f57]/80" />
          <i className="h-2 w-2 rounded-full bg-[#febc2e]/80" />
          <i className="h-2 w-2 rounded-full bg-[#28c840]/80" />
        </span>
        {label ? (
          <span className="mx-auto max-w-[70%] truncate rounded-md bg-white/[0.05] px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-muted">
            {label}
          </span>
        ) : null}
        <span aria-hidden className="w-8" />
      </div>
      {children}
    </div>
  );
}
