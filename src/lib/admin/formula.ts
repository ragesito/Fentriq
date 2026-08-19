/**
 * The Formula, as arithmetic.
 *
 * A client pays a monthly fee; every payment counts toward a total price
 * (900 € by default). When the total is reached the site, domain and code
 * become theirs and billing stops. Everything below is pure so the numbers
 * shown in /admin can be trusted and unit-reasoned about.
 *
 * Money is handled in cents to avoid float drift.
 */

export type ClientStatus = "active" | "owned" | "paused";

export interface Client {
  id: string;
  name: string;
  sector: string;
  city: string;
  siteUrl: string;
  /** Cents billed per month (0 for a one-off purchase). */
  monthlyFeeCents: number;
  /** Cents that make the site theirs. */
  totalPriceCents: number;
  /** ISO date (YYYY-MM-DD) of the first month. */
  startedOn: string;
  paused: boolean;
  notes: string;
}

export interface Payment {
  id: string;
  clientId: string;
  amountCents: number;
  /** ISO date (YYYY-MM-DD). */
  paidOn: string;
  method: "contanti" | "bonifico" | "altro";
  note: string;
}

export interface Progress {
  paidCents: number;
  remainingCents: number;
  totalCents: number;
  /** 0–100, clamped. */
  percent: number;
  monthsPaid: number;
  monthsTotal: number;
  owned: boolean;
  status: ClientStatus;
  /** ISO date of the next expected payment, null once owned or paused. */
  nextDueOn: string | null;
  /** Negative when overdue. Null when there is no next payment. */
  daysUntilDue: number | null;
  overdue: boolean;
}

/** Adds whole months, clamping the day to the target month's length. */
export function addMonths(iso: string, months: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(Date.UTC(y, m - 1 + months, 1));
  const lastDay = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  target.setUTCDate(Math.min(d, lastDay));
  return target.toISOString().slice(0, 10);
}

export function daysBetween(fromIso: string, toIso: string): number {
  const a = Date.parse(fromIso + "T00:00:00Z");
  const b = Date.parse(toIso + "T00:00:00Z");
  return Math.round((b - a) / 86_400_000);
}

export function todayIso(now: Date): string {
  return now.toISOString().slice(0, 10);
}

export function computeProgress(
  client: Client,
  payments: Payment[],
  now: Date,
): Progress {
  const paidCents = payments.reduce((sum, p) => sum + p.amountCents, 0);
  const totalCents = client.totalPriceCents;
  const remainingCents = Math.max(0, totalCents - paidCents);
  const owned = paidCents >= totalCents && totalCents > 0;

  const fee = client.monthlyFeeCents;
  const monthsTotal = fee > 0 ? Math.ceil(totalCents / fee) : 1;
  // Derived from money, not from the number of rows: paying 900 € upfront
  // must read as "9 of 9", and a half payment must not count as a month.
  const monthsPaid = fee > 0 ? Math.min(Math.floor(paidCents / fee), monthsTotal) : owned ? 1 : 0;

  const status: ClientStatus = owned ? "owned" : client.paused ? "paused" : "active";

  const nextDueOn =
    owned || client.paused ? null : addMonths(client.startedOn, monthsPaid);
  const daysUntilDue = nextDueOn ? daysBetween(todayIso(now), nextDueOn) : null;

  return {
    paidCents,
    remainingCents,
    totalCents,
    percent: totalCents > 0 ? Math.min(100, Math.round((paidCents / totalCents) * 100)) : 0,
    monthsPaid,
    monthsTotal,
    owned,
    status,
    nextDueOn,
    daysUntilDue,
    overdue: daysUntilDue !== null && daysUntilDue < 0,
  };
}

/** "1.000,00 €" — Italian formatting, from cents. */
export function euros(cents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/** "15 set 2026" */
export function itDate(iso: string): string {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso + "T00:00:00Z"));
}
