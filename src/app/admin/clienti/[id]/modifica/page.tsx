import { notFound, redirect } from "next/navigation";
import { isLoggedIn } from "@/lib/admin/auth";
import { getClient } from "@/lib/admin/store";
import { AdminShell, Card, Field, LangSelect, TextArea } from "@/components/admin/ui";
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
      title={`Editar ${c.name}`}
      back={{ href: `/admin/clienti/${c.id}`, label: c.name }}
    >
      <Card>
        <form action={saveClient} className="space-y-4">
          <input type="hidden" name="id" value={c.id} />
          <Field label="Nombre" name="name" defaultValue={c.name} required />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Sector" name="sector" defaultValue={c.sector} />
            <Field label="Ciudad" name="city" defaultValue={c.city} />
          </div>
          <Field label="Web" name="siteUrl" defaultValue={c.siteUrl} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field
              label="Cuota mensual €"
              name="monthlyFee"
              type="number"
              step="0.01"
              defaultValue={c.monthlyFeeCents / 100}
            />
            <Field
              label="Precio total €"
              name="totalPrice"
              type="number"
              step="0.01"
              defaultValue={c.totalPriceCents / 100}
            />
            <Field label="Primer mes" name="startedOn" type="date" defaultValue={c.startedOn} />
            <LangSelect value={c.lang} />
          </div>
          <label className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              name="paused"
              defaultChecked={c.paused}
              className="h-4 w-4 rounded border-border bg-surface-2 accent-[var(--color-accent)]"
            />
            <span className="text-muted">En pausa (no contar los cobros previstos)</span>
          </label>
          <TextArea label="Notas" name="notes" rows={3} defaultValue={c.notes} />
          <button
            type="submit"
            className="h-12 w-full rounded-full bg-accent text-sm font-medium text-on-accent transition-colors hover:bg-accent-2 sm:w-auto sm:px-8"
          >
            Guardar
          </button>
        </form>
      </Card>

      <form action={removeClient} className="mt-8">
        <input type="hidden" name="id" value={c.id} />
        <button
          type="submit"
          className="text-sm text-muted transition-colors hover:text-red-400"
        >
          Eliminar cliente y todos sus datos
        </button>
      </form>
    </AdminShell>
  );
}
