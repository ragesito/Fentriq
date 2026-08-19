import { notFound, redirect } from "next/navigation";
import { isLoggedIn } from "@/lib/admin/auth";
import { getClient } from "@/lib/admin/store";
import { AdminShell, Card, Field, TextArea } from "@/components/admin/ui";
import { removeClient, saveClient } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isLoggedIn())) redirect("/admin/login");
  const { id } = await params;
  const c = await getClient(id);
  if (!c) notFound();

  return (
    <AdminShell
      title={`Modifica ${c.name}`}
      back={{ href: `/admin/clienti/${c.id}`, label: c.name }}
    >
      <Card>
        <form action={saveClient} className="space-y-4">
          <input type="hidden" name="id" value={c.id} />
          <Field label="Nome" name="name" defaultValue={c.name} required />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Settore" name="sector" defaultValue={c.sector} />
            <Field label="Città" name="city" defaultValue={c.city} />
          </div>
          <Field label="Sito" name="siteUrl" defaultValue={c.siteUrl} />
          <div className="grid gap-3 sm:grid-cols-3">
            <Field
              label="Quota mensile €"
              name="monthlyFee"
              type="number"
              step="0.01"
              defaultValue={c.monthlyFeeCents / 100}
            />
            <Field
              label="Prezzo totale €"
              name="totalPrice"
              type="number"
              step="0.01"
              defaultValue={c.totalPriceCents / 100}
            />
            <Field label="Primo mese" name="startedOn" type="date" defaultValue={c.startedOn} />
          </div>
          <label className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              name="paused"
              defaultChecked={c.paused}
              className="h-4 w-4 rounded border-border bg-surface-2 accent-[var(--color-accent)]"
            />
            <span className="text-muted">In pausa (non conteggiare gli incassi attesi)</span>
          </label>
          <TextArea label="Note" name="notes" rows={3} defaultValue={c.notes} />
          <button
            type="submit"
            className="h-12 w-full rounded-full bg-accent text-sm font-medium text-on-accent transition-colors hover:bg-accent-2 sm:w-auto sm:px-8"
          >
            Salva
          </button>
        </form>
      </Card>

      <form action={removeClient} className="mt-8">
        <input type="hidden" name="id" value={c.id} />
        <button
          type="submit"
          className="text-sm text-muted transition-colors hover:text-red-400"
        >
          Elimina cliente e tutti i suoi dati
        </button>
      </form>
    </AdminShell>
  );
}
