"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  isLoggedIn,
  verifyPassword,
} from "@/lib/admin/auth";
import {
  addPayment,
  deleteClient,
  deletePayment,
  getClient,
  saveReport,
  upsertClient,
} from "@/lib/admin/store";
import type { Client, Payment } from "@/lib/admin/formula";
import { sourceLabels } from "@/lib/admin/i18n";

/** Every mutating action re-checks the session: a stale form must not write. */
async function requireSession(): Promise<void> {
  if (!(await isLoggedIn())) redirect("/admin/login");
}

function id(): string {
  return crypto.randomUUID();
}

function cents(value: FormDataEntryValue | null): number {
  const raw = String(value ?? "0").replace(/\s/g, "").replace(",", ".");
  return Math.round(Number(raw || 0) * 100);
}

function str(value: FormDataEntryValue | null): string {
  return String(value ?? "").trim();
}

function lines(value: FormDataEntryValue | null): string[] {
  return str(value)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export async function login(_prev: string | null, form: FormData) {
  const ok = await verifyPassword(str(form.get("password")));
  if (!ok) return "Contraseña incorrecta.";
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function saveClient(form: FormData) {
  await requireSession();
  const existingId = str(form.get("id"));
  const client: Client = {
    id: existingId || id(),
    name: str(form.get("name")),
    sector: str(form.get("sector")),
    city: str(form.get("city")),
    siteUrl: str(form.get("siteUrl")),
    monthlyFeeCents: cents(form.get("monthlyFee")),
    totalPriceCents: cents(form.get("totalPrice")),
    startedOn: str(form.get("startedOn")) || new Date().toISOString().slice(0, 10),
    lang: str(form.get("lang")) === "en" ? "en" : "it",
    paused: form.get("paused") === "on",
    notes: str(form.get("notes")),
  };
  if (!client.name) return;
  await upsertClient(client);
  revalidatePath("/admin");
  revalidatePath(`/admin/clienti/${client.id}`);
  redirect(`/admin/clienti/${client.id}`);
}

export async function removeClient(form: FormData) {
  await requireSession();
  await deleteClient(str(form.get("id")));
  revalidatePath("/admin");
  redirect("/admin");
}

export async function recordPayment(form: FormData) {
  await requireSession();
  const clientId = str(form.get("clientId"));
  const client = await getClient(clientId);
  if (!client) return;

  const amount = cents(form.get("amount"));
  const payment: Payment = {
    id: id(),
    clientId,
    // An empty amount means "the usual monthly fee" — the common case when
    // marking a payment from the phone, standing in front of the client.
    amountCents: amount > 0 ? amount : client.monthlyFeeCents,
    paidOn: str(form.get("paidOn")) || new Date().toISOString().slice(0, 10),
    method: (str(form.get("method")) || "contanti") as Payment["method"],
    note: str(form.get("note")),
  };
  await addPayment(payment);
  revalidatePath("/admin");
  revalidatePath(`/admin/clienti/${clientId}`);
}

export async function removePayment(form: FormData) {
  await requireSession();
  await deletePayment(str(form.get("id")));
  const clientId = str(form.get("clientId"));
  revalidatePath("/admin");
  revalidatePath(`/admin/clienti/${clientId}`);
}

export async function saveMonthlyReport(form: FormData) {
  await requireSession();
  const clientId = str(form.get("clientId"));
  const month = str(form.get("month"));
  if (!clientId || !month) return;

  const client = await getClient(clientId);
  if (!client) return;
  const labels = sourceLabels[client.lang];

  const num = (k: string) => Math.max(0, Math.round(Number(str(form.get(k)) || 0)));
  const ratingRaw = str(form.get("rating")).replace(",", ".");

  await saveReport({
    clientId,
    month,
    visits: num("visits"),
    calls: num("calls"),
    directions: num("directions"),
    reviews: num("reviews"),
    rating: ratingRaw ? Number(ratingRaw) : null,
    sources: [
      { label: labels.google, value: num("srcGoogle") },
      { label: labels.direct, value: num("srcDirect") },
      { label: labels.social, value: num("srcSocial") },
    ].filter((s) => s.value > 0),
    done: lines(form.get("done")),
    next: lines(form.get("next")),
    intro: str(form.get("intro")),
    whatsappNote: str(form.get("whatsappNote")),
  });

  revalidatePath(`/admin/clienti/${clientId}`);
  redirect(`/admin/clienti/${clientId}/report/${month}`);
}
