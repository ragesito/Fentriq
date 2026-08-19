import { notFound, redirect } from "next/navigation";
import { isLoggedIn } from "@/lib/admin/auth";
import { getClient, getReport } from "@/lib/admin/store";
import { AdminShell, Card } from "@/components/admin/ui";
import { CopyButton } from "@/components/admin/CopyButton";
import { reportStrings } from "@/lib/admin/i18n";

export const dynamic = "force-dynamic";

/** Previous month's report, so the client sees movement rather than raw numbers. */
function prevMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 2, 1)).toISOString().slice(0, 7);
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

  // The sheet and the message speak the client's language, not the admin's.
  const t = reportStrings[client.lang];
  const nf = new Intl.NumberFormat(t.locale);

  const monthLabel = (() => {
    const [y, m] = month.split("-").map(Number);
    const label = new Intl.DateTimeFormat(t.locale, {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(y, m - 1, 1)));
    return label.charAt(0).toUpperCase() + label.slice(1);
  })();

  const delta = (current: number, previous: number | undefined) => {
    if (previous === undefined) return null;
    const diff = current - previous;
    if (diff === 0) return { text: t.same, tone: "flat" as const };
    const pct = previous === 0 ? null : Math.round((diff / previous) * 100);
    const up = diff > 0;
    return {
      text: `${up ? "↑" : "↓"} ${up ? "+" : ""}${nf.format(diff)}${
        pct === null ? "" : ` (${up ? "+" : ""}${pct}%)`
      } ${t.vsPrev}`,
      tone: up ? ("up" as const) : ("down" as const),
    };
  };

  const rating = report.rating
    ? new Intl.NumberFormat(t.locale).format(report.rating)
    : null;

  const tiles = [
    { label: t.visits, value: report.visits, prev: prev?.visits, isReviews: false },
    { label: t.calls, value: report.calls, prev: prev?.calls, isReviews: false },
    { label: t.directions, value: report.directions, prev: prev?.directions, isReviews: false },
    { label: t.reviews, value: report.reviews, prev: prev?.reviews, isReviews: true },
  ];
  const maxSource = Math.max(...report.sources.map((s) => s.value), 1);

  const arrow = (cur: number, p: number | undefined) =>
    p === undefined ? "" : cur > p ? " ↑" : cur < p ? " ↓" : "";
  const text = [
    t.waGreeting(monthLabel, client.name),
    "",
    t.waVisits(nf.format(report.visits)) + arrow(report.visits, prev?.visits),
    t.waCalls(nf.format(report.calls)) + arrow(report.calls, prev?.calls),
    t.waDirections(nf.format(report.directions)) + arrow(report.directions, prev?.directions),
    t.waReviews(nf.format(report.reviews), rating),
    "",
    report.whatsappNote,
    "",
    t.waClosing,
  ]
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
    .join("\n");

  return (
    <AdminShell
      title={`Informe · ${monthLabel}`}
      back={{ href: `/admin/clienti/${client.id}`, label: client.name }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <CopyButton text={text} />
        <p className="text-sm text-muted">
          Copia el mensaje, haz captura de la hoja de abajo y adjúntala.
        </p>
      </div>

      {/* The sheet the client actually receives — cream paper, brand-consistent. */}
      <div className="on-cream mt-6 overflow-hidden rounded-2xl bg-cream text-ink shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between bg-[#0B0C0F] px-6 py-4">
          <span className="font-mono text-sm font-bold tracking-[0.3em] text-[#F4F6F8]">
            FENTRIQ
          </span>
          <span className="font-mono text-[11px] tracking-[0.14em] text-[#9CA3B2]">
            {t.header}
          </span>
        </div>

        <div className="px-6 py-7 sm:px-8">
          <h2 className="text-3xl font-bold">{client.name}</h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
            {[client.sector, client.city].filter(Boolean).join(" · ")} · {monthLabel}
          </p>
          {report.intro ? (
            <p className="mt-4 leading-relaxed text-ink-muted">{report.intro}</p>
          ) : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {tiles.map((tile) => {
              const d = delta(tile.value, tile.prev);
              return (
                <div
                  key={tile.label}
                  className="rounded-xl border border-ink/10 bg-white/60 p-4"
                >
                  <p className="text-sm text-ink-muted">{tile.label}</p>
                  <p className="mt-1 text-4xl font-bold leading-none">
                    {nf.format(tile.value)}
                    {tile.isReviews && rating ? (
                      <span className="ml-2 text-lg font-normal text-ink-muted">
                        ★ {rating}
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
                    {d ? d.text : t.firstMonth}
                  </p>
                </div>
              );
            })}
          </div>

          {report.sources.length > 0 ? (
            <>
              <h3 className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-deep">
                {t.sources}
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
                {t.done}
              </h3>
              <ul className="mt-3 space-y-1.5">
                {report.done.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <span className="font-bold text-accent-deep">✓</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {report.next.length > 0 ? (
            <>
              <h3 className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-deep">
                {t.next}
              </h3>
              <ul className="mt-3 space-y-1.5">
                {report.next.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <span className="font-bold text-accent-deep">→</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <div className="mt-8 flex justify-between border-t border-dashed border-ink/25 pt-4 font-mono text-[11px] tracking-[0.08em] text-ink-muted">
            <span>{t.footer}</span>
            <span>fentriq.app</span>
          </div>
        </div>
      </div>

      <Card className="mt-6">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
          Mensaje de WhatsApp
        </p>
        <pre className="mt-3 whitespace-pre-wrap font-body text-sm text-text/90">
          {text}
        </pre>
      </Card>
    </AdminShell>
  );
}
