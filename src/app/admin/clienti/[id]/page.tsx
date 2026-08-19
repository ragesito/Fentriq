import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isLoggedIn } from "@/lib/admin/auth";
import {
  getClient,
  getReport,
  listPayments,
  listReportMonths,
} from "@/lib/admin/store";
import { computeProgress, euros, itDate } from "@/lib/admin/formula";
import { AdminShell, Card, DueBadge, Field, FormulaBar, TextArea } from "@/components/admin/ui";
import { recordPayment, removePayment, saveMonthlyReport } from "../../actions";

export const dynamic = "force-dynamic";

/** Previous calendar month as YYYY-MM — the one you normally report on. */
function lastMonth(now: Date): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  return d.toISOString().slice(0, 7);
}

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isLoggedIn())) redirect("/admin/login");
  const { id } = await params;
  if (id === "nuovo") redirect("/admin/clienti/nuovo");

  const client = await getClient(id);
  if (!client) notFound();

  const now = new Date();
  const payments = await listPayments(id);
  const progress = computeProgress(client, payments, now);
  const months = await listReportMonths(id);
  const month = lastMonth(now);
  const draft = await getReport(id, month);
  const today = now.toISOString().slice(0, 10);

  return (
    <AdminShell title={client.name} back={{ href: "/admin", label: "Clienti" }}>
      <div className="flex flex-wrap items-center gap-3">
        <DueBadge p={progress} />
        {client.siteUrl ? (
          <a
            href={client.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent transition-colors hover:text-accent-2"
          >
            {client.siteUrl.replace(/^https?:\/\//, "")} ↗
          </a>
        ) : null}
        <Link
          href={`/admin/clienti/${id}/modifica`}
          className="text-sm text-muted transition-colors hover:text-text"
        >
          Modifica dati
        </Link>
      </div>

      <Card className="mt-6">
        <FormulaBar p={progress} />
        <p className="mt-3 text-sm text-muted">
          {progress.owned
            ? "Ha completato il percorso: sito, dominio e codice sono suoi."
            : `Mancano ${euros(progress.remainingCents)} — ${
                progress.monthsTotal - progress.monthsPaid
              } mesi al passaggio di proprietà.`}
        </p>
      </Card>

      {/* Record a payment */}
      <h2 className="mt-10 font-mono text-xs uppercase tracking-[0.14em] text-accent">
        Registra un incasso
      </h2>
      <Card className="mt-3">
        <form action={recordPayment} className="grid gap-3 sm:grid-cols-4">
          <input type="hidden" name="clientId" value={client.id} />
          <Field
            label="Importo €"
            name="amount"
            type="number"
            step="0.01"
            placeholder={String(client.monthlyFeeCents / 100)}
          />
          <Field label="Data" name="paidOn" type="date" defaultValue={today} />
          <label className="block">
            <span className="text-sm text-muted">Metodo</span>
            <select
              name="method"
              className="mt-1.5 w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-text outline-none focus:border-accent/60"
            >
              <option value="contanti">Contanti</option>
              <option value="bonifico">Bonifico</option>
              <option value="altro">Altro</option>
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="h-11 w-full rounded-full bg-accent px-4 text-sm font-medium text-on-accent transition-colors hover:bg-accent-2"
            >
              Salva
            </button>
          </div>
        </form>
      </Card>

      {/* Ledger */}
      <h2 className="mt-10 font-mono text-xs uppercase tracking-[0.14em] text-accent">
        Incassi ({payments.length})
      </h2>
      <div className="mt-3 space-y-2">
        {payments.length === 0 ? (
          <p className="text-sm text-muted">Nessun incasso registrato.</p>
        ) : null}
        {payments.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3"
          >
            <div className="min-w-0">
              <span className="font-semibold">{euros(p.amountCents)}</span>
              <span className="ml-3 text-sm text-muted">{itDate(p.paidOn)}</span>
              <span className="ml-3 font-mono text-xs uppercase text-muted/70">
                {p.method}
              </span>
            </div>
            <form action={removePayment}>
              <input type="hidden" name="id" value={p.id} />
              <input type="hidden" name="clientId" value={client.id} />
              <button
                type="submit"
                aria-label="Elimina incasso"
                className="text-sm text-muted transition-colors hover:text-red-400"
              >
                Elimina
              </button>
            </form>
          </div>
        ))}
      </div>

      {/* Monthly report data entry */}
      <h2 className="mt-10 font-mono text-xs uppercase tracking-[0.14em] text-accent">
        Report del mese
      </h2>
      <Card className="mt-3">
        <form action={saveMonthlyReport} className="space-y-4">
          <input type="hidden" name="clientId" value={client.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Mese (AAAA-MM)" name="month" defaultValue={draft?.month ?? month} required />
            <Field
              label="Media recensioni (opzionale)"
              name="rating"
              defaultValue={draft?.rating ?? ""}
              placeholder="4,6"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Field label="Visite" name="visits" type="number" defaultValue={draft?.visits ?? ""} />
            <Field label="Chiamate" name="calls" type="number" defaultValue={draft?.calls ?? ""} />
            <Field label="Indicazioni" name="directions" type="number" defaultValue={draft?.directions ?? ""} />
            <Field label="Recensioni" name="reviews" type="number" defaultValue={draft?.reviews ?? ""} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field
              label="Da Google"
              name="srcGoogle"
              type="number"
              defaultValue={draft?.sources.find((s) => s.label === "Ricerca Google")?.value ?? ""}
            />
            <Field
              label="Diretto"
              name="srcDirect"
              type="number"
              defaultValue={draft?.sources.find((s) => s.label === "Diretto")?.value ?? ""}
            />
            <Field
              label="Social e QR"
              name="srcSocial"
              type="number"
              defaultValue={draft?.sources.find((s) => s.label === "Social e QR")?.value ?? ""}
            />
          </div>

          <TextArea
            label="Introduzione"
            name="intro"
            rows={2}
            defaultValue={draft?.intro ?? ""}
            hint="una frase, in italiano semplice"
          />
          <TextArea
            label="Cosa abbiamo fatto"
            name="done"
            defaultValue={draft?.done.join("\n") ?? ""}
            hint="una riga per punto"
          />
          <TextArea
            label="Cosa facciamo il prossimo"
            name="next"
            defaultValue={draft?.next.join("\n") ?? ""}
            hint="una riga per punto"
          />
          <TextArea
            label="Nota per WhatsApp"
            name="whatsappNote"
            rows={2}
            defaultValue={draft?.whatsappNote ?? ""}
          />

          <button
            type="submit"
            className="h-12 w-full rounded-full bg-accent text-sm font-medium text-on-accent transition-colors hover:bg-accent-2 sm:w-auto sm:px-8"
          >
            Salva e genera il report
          </button>
        </form>
      </Card>

      {months.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {months.map((m) => (
            <Link
              key={m}
              href={`/admin/clienti/${client.id}/report/${m}`}
              className="rounded-full border border-border px-3.5 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent/60 hover:text-text"
            >
              {m}
            </Link>
          ))}
        </div>
      ) : null}
    </AdminShell>
  );
}
