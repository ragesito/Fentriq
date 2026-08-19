import { notFound, redirect } from "next/navigation";
import { isLoggedIn } from "@/lib/admin/auth";
import { getClient, getReport } from "@/lib/admin/store";
import { AdminShell, Card } from "@/components/admin/ui";
import { CopyButton } from "@/components/admin/CopyButton";
import type { MonthlyReport } from "@/lib/admin/store";
import type { Client } from "@/lib/admin/formula";

export const dynamic = "force-dynamic";

const nf = new Intl.NumberFormat("it-IT");

function monthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  const label = new Intl.DateTimeFormat("it-IT", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, 1)));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Previous month's report, so the client sees movement rather than raw numbers. */
function prevMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 2, 1)).toISOString().slice(0, 7);
}

function delta(current: number, previous: number | undefined) {
  if (previous === undefined) return null;
  const diff = current - previous;
  if (diff === 0) return { text: "uguale al mese scorso", tone: "flat" as const };
  const pct = previous === 0 ? null : Math.round((diff / previous) * 100);
  const up = diff > 0;
  return {
    text: `${up ? "↑" : "↓"} ${up ? "+" : ""}${nf.format(diff)}${
      pct === null ? "" : ` (${up ? "+" : ""}${pct}%)`
    } vs mese scorso`,
    tone: up ? ("up" as const) : ("down" as const),
  };
}

function whatsappText(client: Client, r: MonthlyReport, prev: MonthlyReport | null) {
  const arrow = (cur: number, p: number | undefined) =>
    p === undefined ? "" : cur > p ? " ↑" : cur < p ? " ↓" : "";
  return [
    `Buongiorno! 👋 Ecco il report di ${monthLabel(r.month)} per ${client.name}.`,
    "",
    `📈 ${nf.format(r.visits)} persone hanno visto il sito${arrow(r.visits, prev?.visits)}`,
    `📞 ${nf.format(r.calls)} vi hanno chiamato da Google${arrow(r.calls, prev?.calls)}`,
    `📍 ${nf.format(r.directions)} hanno chiesto come arrivare${arrow(r.directions, prev?.directions)}`,
    `⭐ ${nf.format(r.reviews)} nuove recensioni${
      r.rating ? ` (media ${String(r.rating).replace(".", ",")})` : ""
    }`,
    "",
    r.whatsappNote,
    "",
    "Vi allego il report completo. Per qualsiasi cosa sono qui 🙂",
  ]
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
    .join("\n");
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string; month: string }>;
}) {
  if (!(await isLoggedIn())) redirect("/admin/login");
  const { id, month } = await params;
  const [client, report] = await Promise.all([getClient(id), getReport(id, month)]);
  if (!client || !report) notFound();
  const prev = await getReport(id, prevMonth(month));

  const tiles = [
    { label: "Persone che hanno visto il sito", value: report.visits, prev: prev?.visits },
    { label: "Hanno chiamato da Google", value: report.calls, prev: prev?.calls },
    { label: "Hanno chiesto indicazioni", value: report.directions, prev: prev?.directions },
    { label: "Nuove recensioni", value: report.reviews, prev: prev?.reviews },
  ];
  const maxSource = Math.max(...report.sources.map((s) => s.value), 1);
  const text = whatsappText(client, report, prev);

  return (
    <AdminShell
      title={`Report · ${monthLabel(report.month)}`}
      back={{ href: `/admin/clienti/${client.id}`, label: client.name }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <CopyButton text={text} />
        <p className="text-sm text-muted">
          Copia il testo, poi fai uno screenshot del foglio qui sotto e allegalo.
        </p>
      </div>

      {/* The sheet the client actually receives — cream paper, brand-consistent. */}
      <div className="on-cream mt-6 overflow-hidden rounded-2xl bg-cream text-ink shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between bg-[#0B0C0F] px-6 py-4">
          <span className="font-mono text-sm font-bold tracking-[0.3em] text-[#F4F6F8]">
            FENTRIQ
          </span>
          <span className="font-mono text-[11px] tracking-[0.14em] text-[#9CA3B2]">
            REPORT MENSILE
          </span>
        </div>

        <div className="px-6 py-7 sm:px-8">
          <h2 className="text-3xl font-bold">{client.name}</h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
            {[client.sector, client.city].filter(Boolean).join(" · ")} ·{" "}
            {monthLabel(report.month)}
          </p>
          {report.intro ? (
            <p className="mt-4 leading-relaxed text-ink-muted">{report.intro}</p>
          ) : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {tiles.map((t) => {
              const d = delta(t.value, t.prev);
              return (
                <div
                  key={t.label}
                  className="rounded-xl border border-ink/10 bg-white/60 p-4"
                >
                  <p className="text-sm text-ink-muted">{t.label}</p>
                  <p className="mt-1 text-4xl font-bold leading-none">
                    {nf.format(t.value)}
                    {t.label.startsWith("Nuove") && report.rating ? (
                      <span className="ml-2 text-lg font-normal text-ink-muted">
                        ★ {String(report.rating).replace(".", ",")}
                      </span>
                    ) : null}
                  </p>
                  <p
                    className={`mt-2 text-sm font-semibold ${
                      d?.tone === "up"
                        ? "text-emerald-700"
                        : d?.tone === "down"
                          ? "text-red-700"
                          : "font-normal text-ink-muted"
                    }`}
                  >
                    {d ? d.text : "Primo mese — è la base di partenza"}
                  </p>
                </div>
              );
            })}
          </div>

          {report.sources.length > 0 ? (
            <>
              <h3 className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-deep">
                Da dove sono arrivati
              </h3>
              <div className="mt-3 space-y-2.5">
                {report.sources.map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className="w-40 shrink-0 text-sm">{s.label}</span>
                    <span className="h-3 flex-1 overflow-hidden rounded-full bg-ink/10">
                      <span
                        className="block h-full rounded-full bg-accent-deep"
                        style={{ width: `${Math.max((s.value / maxSource) * 100, 3)}%` }}
                      />
                    </span>
                    <span className="w-12 shrink-0 text-right text-sm font-bold">
                      {nf.format(s.value)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {report.done.length > 0 ? (
            <>
              <h3 className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-deep">
                Cosa abbiamo fatto questo mese
              </h3>
              <ul className="mt-3 space-y-1.5">
                {report.done.map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span className="font-bold text-accent-deep">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {report.next.length > 0 ? (
            <>
              <h3 className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-deep">
                Cosa facciamo il prossimo
              </h3>
              <ul className="mt-3 space-y-1.5">
                {report.next.map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span className="font-bold text-accent-deep">→</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <div className="mt-8 flex justify-between border-t border-dashed border-ink/25 pt-4 font-mono text-[11px] tracking-[0.08em] text-ink-muted">
            <span>FENTRIQ · STUDIO DI SVILUPPO SOFTWARE</span>
            <span>fentriq.app</span>
          </div>
        </div>
      </div>

      <Card className="mt-6">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
          Messaggio WhatsApp
        </p>
        <pre className="mt-3 whitespace-pre-wrap font-body text-sm text-text/90">
          {text}
        </pre>
      </Card>
    </AdminShell>
  );
}
