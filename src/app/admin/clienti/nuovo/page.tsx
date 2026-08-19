import { redirect } from "next/navigation";
import { isLoggedIn } from "@/lib/admin/auth";
import { AdminShell, Card, Field, LangSelect, TextArea } from "@/components/admin/ui";
import { saveClient } from "../../actions";

export const dynamic = "force-dynamic";

export default async function NewClientPage() {
  if (!(await isLoggedIn())) redirect("/admin/login");
  const today = new Date().toISOString().slice(0, 10);

  return (
    <AdminShell title="Nuevo cliente" back={{ href: "/admin", label: "Clientes" }}>
      <Card>
        <form action={saveClient} className="space-y-4">
          <Field label="Nombre" name="name" required placeholder="Nonsolofitness" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Sector" name="sector" placeholder="Gimnasio" />
            <Field label="Ciudad" name="city" placeholder="Torvaianica" />
          </div>
          <Field label="Web" name="siteUrl" placeholder="https://…" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Cuota mensual €" name="monthlyFee" type="number" step="0.01" defaultValue={100} />
            <Field label="Precio total €" name="totalPrice" type="number" step="0.01" defaultValue={900} />
            <Field label="Primer mes" name="startedOn" type="date" defaultValue={today} />
            <LangSelect />
          </div>
          <TextArea label="Notas" name="notes" rows={3} />
          <button
            type="submit"
            className="h-12 w-full rounded-full bg-accent text-sm font-medium text-on-accent transition-colors hover:bg-accent-2 sm:w-auto sm:px-8"
          >
            Crear cliente
          </button>
        </form>
      </Card>
    </AdminShell>
  );
}
