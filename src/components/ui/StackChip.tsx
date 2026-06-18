import { cn } from "@/lib/cn";

export function StackChip({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted",
        className,
      )}
    >
      {label}
    </span>
  );
}

export function StackChips({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((s) => (
        <li key={s}>
          <StackChip label={s} />
        </li>
      ))}
    </ul>
  );
}
