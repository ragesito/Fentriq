import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { euros, itDate, type Progress } from "@/lib/admin/formula";

export function AdminShell({
  title,
  back,
  children,
}: {
  title: string;
  back?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <header className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          {back ? (
            <Link
              href={back.href}
              className="font-mono text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:text-text"
            >
              ← {back.label}
            </Link>
          ) : (
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              Fentriq · Admin
            </p>
          )}
          <h1 className="mt-2 truncate text-2xl font-bold sm:text-3xl">{title}</h1>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="shrink-0 rounded-full border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:border-accent/60 hover:text-text"
          >
            Esci
          </button>
        </form>
      </header>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-surface p-5 ${className}`}>
      {children}
    </div>
  );
}

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required,
  step,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
  step?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm text-muted">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-text outline-none focus:border-accent/60"
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  rows = 4,
  defaultValue,
  hint,
}: {
  label: string;
  name: string;
  rows?: number;
  defaultValue?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-muted">{label}</span>
      {hint ? <span className="ml-2 text-xs text-muted/70">{hint}</span> : null}
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-text outline-none focus:border-accent/60"
      />
    </label>
  );
}

/** Progress toward ownership — the number that defines the Formula. */
export function FormulaBar({ p }: { p: Progress }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-semibold">
          {euros(p.paidCents)}{" "}
          <span className="font-normal text-muted">/ {euros(p.totalCents)}</span>
        </span>
        <span className="font-mono text-xs text-muted">
          {p.owned ? "completato" : `mese ${p.monthsPaid} di ${p.monthsTotal}`}
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className={`h-full rounded-full ${p.owned ? "bg-emerald-500" : "bg-accent"}`}
          style={{ width: `${Math.max(p.percent, 2)}%` }}
        />
      </div>
    </div>
  );
}

/** Status of the next collection: never colour alone — always words. */
export function DueBadge({ p }: { p: Progress }) {
  if (p.owned) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
        ✓ Il sito è suo
      </span>
    );
  }
  if (p.status === "paused") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-muted">
        In pausa
      </span>
    );
  }
  const d = p.daysUntilDue ?? 0;
  const label = p.nextDueOn ? itDate(p.nextDueOn) : "";
  if (d < 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-xs font-medium text-red-300">
        ⚠ In ritardo di {Math.abs(d)} g · {label}
      </span>
    );
  }
  if (d <= 5) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-300">
        ⏳ Da incassare fra {d} g · {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-muted">
      Prossimo incasso {label}
    </span>
  );
}
