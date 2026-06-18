/**
 * The signature "fold" — a thin diagonal seam that separates sections,
 * echoing the folded band of the logo. Decorative only.
 */
export function FoldDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div aria-hidden className="relative h-px w-full overflow-visible">
      <svg
        className="absolute left-0 top-1/2 h-8 w-full -translate-y-1/2"
        viewBox="0 0 1200 32"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d={flip ? "M0 8 L1200 24" : "M0 24 L1200 8"}
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <path
          d={flip ? "M0 8 L1200 24" : "M0 24 L1200 8"}
          stroke="url(#fold-grad)"
          strokeWidth="1"
          strokeDasharray="2 6"
          opacity="0.5"
        />
        <defs>
          <linearGradient id="fold-grad" x1="0" y1="0" x2="1200" y2="0">
            <stop stopColor="#4F5BF7" stopOpacity="0" />
            <stop offset="0.5" stopColor="#8A6CFF" stopOpacity="0.7" />
            <stop offset="1" stopColor="#4F5BF7" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
