import { neon } from "@neondatabase/serverless";
import fs from "node:fs";
import path from "node:path";
import type { Client, Payment } from "./formula";

/**
 * Storage for the private admin.
 *
 * Production runs on Postgres (Neon free tier) via DATABASE_URL. In local
 * development, when no DATABASE_URL is set, it falls back to a gitignored
 * JSON file so the UI can be built and reviewed without a database. That
 * fallback is deliberately refused in production: silently "working" on an
 * ephemeral filesystem would lose payment records on every cold start.
 */

export interface MonthlyReport {
  clientId: string;
  /** YYYY-MM */
  month: string;
  visits: number;
  calls: number;
  directions: number;
  reviews: number;
  rating: number | null;
  sources: { label: string; value: number }[];
  done: string[];
  next: string[];
  intro: string;
  whatsappNote: string;
}

const DEV_FILE = path.join(process.cwd(), ".admin-data.json");

function isProd(): boolean {
  return process.env.NODE_ENV === "production";
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/** False only in production without a database — the admin then shows setup help. */
export function isConfigured(): boolean {
  return hasDatabase() || !isProd();
}

/* ------------------------------------------------------------------ *
 * Dev JSON backend
 * ------------------------------------------------------------------ */

interface DevData {
  clients: Client[];
  payments: Payment[];
  reports: MonthlyReport[];
}

function devRead(): DevData {
  try {
    return JSON.parse(fs.readFileSync(DEV_FILE, "utf8")) as DevData;
  } catch {
    return { clients: [], payments: [], reports: [] };
  }
}

function devWrite(data: DevData): void {
  fs.writeFileSync(DEV_FILE, JSON.stringify(data, null, 2));
}

/* ------------------------------------------------------------------ *
 * Postgres backend
 * ------------------------------------------------------------------ */

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

let schemaReady = false;

/** Creates the tables on first use — no migration tooling for three tables. */
export async function ensureSchema(): Promise<void> {
  if (!hasDatabase() || schemaReady) return;
  const q = sql();
  await q`CREATE TABLE IF NOT EXISTS clients (
    id text PRIMARY KEY,
    name text NOT NULL,
    sector text NOT NULL DEFAULT '',
    city text NOT NULL DEFAULT '',
    site_url text NOT NULL DEFAULT '',
    monthly_fee_cents integer NOT NULL DEFAULT 10000,
    total_price_cents integer NOT NULL DEFAULT 90000,
    started_on date NOT NULL,
    paused boolean NOT NULL DEFAULT false,
    notes text NOT NULL DEFAULT ''
  )`;
  // Added after the first release; idempotent so old databases catch up.
  await q`ALTER TABLE clients ADD COLUMN IF NOT EXISTS lang text NOT NULL DEFAULT 'it'`;
  await q`CREATE TABLE IF NOT EXISTS payments (
    id text PRIMARY KEY,
    client_id text NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    amount_cents integer NOT NULL,
    paid_on date NOT NULL,
    method text NOT NULL DEFAULT 'contanti',
    note text NOT NULL DEFAULT ''
  )`;
  await q`CREATE TABLE IF NOT EXISTS reports (
    client_id text NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    month text NOT NULL,
    visits integer NOT NULL DEFAULT 0,
    calls integer NOT NULL DEFAULT 0,
    directions integer NOT NULL DEFAULT 0,
    reviews integer NOT NULL DEFAULT 0,
    rating numeric,
    sources jsonb NOT NULL DEFAULT '[]',
    done jsonb NOT NULL DEFAULT '[]',
    next jsonb NOT NULL DEFAULT '[]',
    intro text NOT NULL DEFAULT '',
    whatsapp_note text NOT NULL DEFAULT '',
    PRIMARY KEY (client_id, month)
  )`;
  schemaReady = true;
}

/* ------------------------------------------------------------------ *
 * Public API
 * ------------------------------------------------------------------ */

type Row = Record<string, unknown>;

/**
 * Postgres DATE values can arrive as a string or a Date depending on driver
 * and column type. Everything downstream does date arithmetic on YYYY-MM-DD,
 * and an unparseable value throws deep inside that maths, so normalise here.
 */
function isoDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }
  const raw = String(value ?? "");
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.valueOf())) return parsed.toISOString().slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

function toClient(r: Row): Client {
  return {
    id: String(r.id),
    name: String(r.name),
    sector: String(r.sector ?? ""),
    city: String(r.city ?? ""),
    siteUrl: String(r.site_url ?? ""),
    monthlyFeeCents: Number(r.monthly_fee_cents),
    totalPriceCents: Number(r.total_price_cents),
    startedOn: isoDate(r.started_on),
    lang: (String(r.lang ?? "it") === "en" ? "en" : "it") as Client["lang"],
    paused: Boolean(r.paused),
    notes: String(r.notes ?? ""),
  };
}

function toPayment(r: Row): Payment {
  return {
    id: String(r.id),
    clientId: String(r.client_id),
    amountCents: Number(r.amount_cents),
    paidOn: isoDate(r.paid_on),
    method: String(r.method) as Payment["method"],
    note: String(r.note ?? ""),
  };
}

export async function listClients(): Promise<Client[]> {
  if (!hasDatabase()) return devRead().clients;
  await ensureSchema();
  const rows = (await sql()`SELECT * FROM clients ORDER BY name`) as Row[];
  return rows.map(toClient);
}

export async function getClient(id: string): Promise<Client | null> {
  if (!hasDatabase()) return devRead().clients.find((c) => c.id === id) ?? null;
  await ensureSchema();
  const rows = (await sql()`SELECT * FROM clients WHERE id = ${id}`) as Row[];
  return rows[0] ? toClient(rows[0]) : null;
}

export async function upsertClient(c: Client): Promise<void> {
  if (!hasDatabase()) {
    const data = devRead();
    const i = data.clients.findIndex((x) => x.id === c.id);
    if (i === -1) data.clients.push(c);
    else data.clients[i] = c;
    devWrite(data);
    return;
  }
  await ensureSchema();
  await sql()`INSERT INTO clients
    (id, name, sector, city, site_url, monthly_fee_cents, total_price_cents, started_on, lang, paused, notes)
    VALUES (${c.id}, ${c.name}, ${c.sector}, ${c.city}, ${c.siteUrl},
            ${c.monthlyFeeCents}, ${c.totalPriceCents}, ${c.startedOn}, ${c.lang}, ${c.paused}, ${c.notes})
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name, sector = EXCLUDED.sector, city = EXCLUDED.city,
      site_url = EXCLUDED.site_url, monthly_fee_cents = EXCLUDED.monthly_fee_cents,
      total_price_cents = EXCLUDED.total_price_cents, started_on = EXCLUDED.started_on,
      lang = EXCLUDED.lang,
      paused = EXCLUDED.paused, notes = EXCLUDED.notes`;
}

export async function deleteClient(id: string): Promise<void> {
  if (!hasDatabase()) {
    const data = devRead();
    data.clients = data.clients.filter((c) => c.id !== id);
    data.payments = data.payments.filter((p) => p.clientId !== id);
    data.reports = data.reports.filter((r) => r.clientId !== id);
    devWrite(data);
    return;
  }
  await ensureSchema();
  await sql()`DELETE FROM clients WHERE id = ${id}`;
}

export async function listPayments(clientId?: string): Promise<Payment[]> {
  if (!hasDatabase()) {
    const all = devRead().payments;
    return (clientId ? all.filter((p) => p.clientId === clientId) : all).sort((a, b) =>
      b.paidOn.localeCompare(a.paidOn),
    );
  }
  await ensureSchema();
  const rows = (
    clientId
      ? await sql()`SELECT * FROM payments WHERE client_id = ${clientId} ORDER BY paid_on DESC`
      : await sql()`SELECT * FROM payments ORDER BY paid_on DESC`
  ) as Row[];
  return rows.map(toPayment);
}

export async function addPayment(p: Payment): Promise<void> {
  if (!hasDatabase()) {
    const data = devRead();
    data.payments.push(p);
    devWrite(data);
    return;
  }
  await ensureSchema();
  await sql()`INSERT INTO payments (id, client_id, amount_cents, paid_on, method, note)
    VALUES (${p.id}, ${p.clientId}, ${p.amountCents}, ${p.paidOn}, ${p.method}, ${p.note})`;
}

export async function deletePayment(id: string): Promise<void> {
  if (!hasDatabase()) {
    const data = devRead();
    data.payments = data.payments.filter((p) => p.id !== id);
    devWrite(data);
    return;
  }
  await ensureSchema();
  await sql()`DELETE FROM payments WHERE id = ${id}`;
}

export async function getReport(
  clientId: string,
  month: string,
): Promise<MonthlyReport | null> {
  if (!hasDatabase()) {
    return (
      devRead().reports.find((r) => r.clientId === clientId && r.month === month) ?? null
    );
  }
  await ensureSchema();
  const rows = (await sql()`SELECT * FROM reports
    WHERE client_id = ${clientId} AND month = ${month}`) as Row[];
  const r = rows[0];
  if (!r) return null;
  return {
    clientId,
    month,
    visits: Number(r.visits),
    calls: Number(r.calls),
    directions: Number(r.directions),
    reviews: Number(r.reviews),
    rating: r.rating === null ? null : Number(r.rating),
    sources: r.sources as MonthlyReport["sources"],
    done: r.done as string[],
    next: r.next as string[],
    intro: String(r.intro ?? ""),
    whatsappNote: String(r.whatsapp_note ?? ""),
  };
}

export async function listReportMonths(clientId: string): Promise<string[]> {
  if (!hasDatabase()) {
    return devRead()
      .reports.filter((r) => r.clientId === clientId)
      .map((r) => r.month)
      .sort((a, b) => b.localeCompare(a));
  }
  await ensureSchema();
  const rows = (await sql()`SELECT month FROM reports
    WHERE client_id = ${clientId} ORDER BY month DESC`) as Row[];
  return rows.map((r) => String(r.month));
}

export async function saveReport(r: MonthlyReport): Promise<void> {
  if (!hasDatabase()) {
    const data = devRead();
    const i = data.reports.findIndex(
      (x) => x.clientId === r.clientId && x.month === r.month,
    );
    if (i === -1) data.reports.push(r);
    else data.reports[i] = r;
    devWrite(data);
    return;
  }
  await ensureSchema();
  await sql()`INSERT INTO reports
    (client_id, month, visits, calls, directions, reviews, rating, sources, done, next, intro, whatsapp_note)
    VALUES (${r.clientId}, ${r.month}, ${r.visits}, ${r.calls}, ${r.directions},
            ${r.reviews}, ${r.rating}, ${JSON.stringify(r.sources)},
            ${JSON.stringify(r.done)}, ${JSON.stringify(r.next)}, ${r.intro}, ${r.whatsappNote})
    ON CONFLICT (client_id, month) DO UPDATE SET
      visits = EXCLUDED.visits, calls = EXCLUDED.calls, directions = EXCLUDED.directions,
      reviews = EXCLUDED.reviews, rating = EXCLUDED.rating, sources = EXCLUDED.sources,
      done = EXCLUDED.done, next = EXCLUDED.next, intro = EXCLUDED.intro,
      whatsapp_note = EXCLUDED.whatsapp_note`;
}
