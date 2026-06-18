import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("eyebrow flex items-center gap-2", className)}>
      <span aria-hidden className="inline-block h-px w-6 bg-accent/60" />
      {children}
    </p>
  );
}
