import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthEnabled, isLoggedIn } from "@/lib/admin/auth";
import { isConfigured, listClients, listPayments } from "@/lib/admin/store";
import { computeProgress, euros } from "@/lib/admin/formula";
import { AdminShell, Card, DueBadge, FormulaBar } from "@/components/admin/ui";
import { ErrorPanel } from "@/components/admin/ErrorPanel";
import { recordPayment } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!isAuthEnabled()) return <Setup missing="ADMIN_PASSWORD" />;
  if (!(await isLoggedIn())) redirect("/admin/login");
  if (!isConfigured()) return <Setup missing="DATABASE_URL" />;

  const now = new Date();
  let clients, payments;
  try {
    [clients, payments] = await Promise.all([listClients(), listPayments()]);
  } catch (error) {
    return <ErrorPanel error={error} />;
  }

  const rows = clients
    .map((c) => ({
      client: c,
      progress: computeProgress(
        c,
        payments.filter((p) => p.clientId === c.id),
        now,
      ),
    }))
    // Whoever needs collecting first goes on top.
    .sort((a, b) => {
      const av = a.progress.owned ? Infinity : (a.progress.daysUntilDue ?? Infinity);
      const bv = b.progress.owned ? Infinity : (b.progress.daysUntilDue ?? Infinity);
      return av - bv;
    });

  const collected = payments.reduce((s, p) => s + p.amountCents, 0);
  const recurring = rows
    .filter((r) => r.progress.status === "active")
    .reduce((s, r) => s + r.client.monthlyFeeCents, 0);
  const toCollect = rows.filter(
    (r) => !r.progress.owned && (r.progress.daysUntilDue ?? 99) <= 5,
  ).length;

  return (
    <AdminShell title="Mis clientes">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Cobrado en total" value={euros(collected)} />
        <Stat label="Recurrente al mes" value={euros(recurring)} />
        <Stat
          label="Por cobrar ahora"
          value={String(toCollect)}
          tone={toCollect > 0 ? "warn" : undefined}
          className="col-span-2 sm:col-span-1"
        />
      </div>

      <div className="mt-8 space-y-4">
        {rows.length === 0 ? (
          <Card>
            <p className="text-muted">
              Todavía no hay clientes. Añade el primero para empezar a llevar las cuentas.
            </p>
          </Card>
        ) : null}

        {rows.map(({ client, progress }) => (
          <Card key={client.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/admin/clienti/${client.id}`}
                  className="text-lg font-semibold transition-colors hover:text-accent"
                >
                  {client.name}
                </Link>
                <p className="mt-0.5 font-mono text-xs uppercase tracking-[0.06em] text-muted">
                  {[client.sector, client.city].filter(Boolean).join(" · ")}
                </p>
              </div>
              <DueBadge p={progress} />
            </div>

            <div className="mt-4">
              <FormulaBar p={progress} />
            </div>

            {!progress.owned ? (
              <form action={recordPayment} className="mt-4 flex items-center gap-2">
                <input type="hidden" name="clientId" value={client.id} />
                <button
                  type="submit"
                  className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-colors hover:bg-accent-2"
                >
                  Cobrados {euros(client.monthlyFeeCents)}
                </button>
                <Link
                  href={`/admin/clienti/${client.id}`}
                  className="text-sm text-muted transition-colors hover:text-text"
                >
                  Detalles
                </Link>
              </form>
            ) : null}
          </Card>
        ))}
      </div>

      <Link
        href="/admin/clienti/nuovo"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium transition-colors hover:border-accent/60"
      >
        + Añadir cliente
      </Link>
    </AdminShell>
  );
}

function Stat({
  label,
  value,
  tone,
  className = "",
}: {
  label: string;
  value: string;
  tone?: "warn";
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-surface p-4 ${className}`}>
      <p className="text-xs text-muted">{label}</p>
      <p
        className={`mt-1 text-2xl font-bold ${tone === "warn" ? "text-amber-300" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function Setup({ missing }: { missing: string }) {
  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
        Fentriq · Admin
      </p>
      <h1 className="mt-4 text-2xl font-bold">Falta una variable: {missing}</h1>
      <p className="mt-4 text-muted">
        Configura <code className="text-text">{missing}</code> en las variables
        de entorno del proyecto (Vercel → Settings → Environment Variables) y vuelve
        a desplegar.
      </p>
      <ul className="mt-6 space-y-2 text-sm text-muted">
        <li>
          <code className="text-text">ADMIN_PASSWORD</code> — la contraseña de acceso
        </li>
        <li>
          <code className="text-text">ADMIN_SECRET</code> — una cadena larga al azar,
          para firmar la cookie
        </li>
        <li>
          <code className="text-text">DATABASE_URL</code> — la conexión Postgres
          (Neon, plan gratuito)
        </li>
      </ul>
    </div>
  );
}
