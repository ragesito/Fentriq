import { cn } from "@/lib/cn";

export function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[var(--maxw)] px-5 sm:px-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}
