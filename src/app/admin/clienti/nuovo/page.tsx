import { redirect } from "next/navigation";
import { isLoggedIn } from "@/lib/admin/auth";
import { AdminShell, Card, Field, TextArea } from "@/components/admin/ui";
import { saveClient } from "../../actions";

export const dynamic = "force-dynamic";

export default async function NewClientPage() {
  if (!(await isLoggedIn())) redirect("/admin/login");
  const today = new Date().toISOString().slice(0, 10);

  return (
    <AdminShell title="Nuovo cliente" back={{ href: "/admin", label: "Clienti" }}>
      <Card>
        <form action={saveClient} className="space-y-4">
          <Field label="Nome" name="name" required placeholder="Nonsolofitness" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Settore" name="sector" placeholder="Palestra" />
            <Field label="Città" name="city" placeholder="Torvaianica" />
          </div>
          <Field label="Sito" name="siteUrl" placeholder="https://…" />
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Quota mensile €" name="monthlyFee" type="number" step="0.01" defaultValue={100} />
            <Field label="Prezzo totale €" name="totalPrice" type="number" step="0.01" defaultValue={900} />
            <Field label="Primo mese" name="startedOn" type="date" defaultValue={today} />
          </div>
          <TextArea label="Note" name="notes" rows={3} />
          <button
            type="submit"
            className="h-12 w-full rounded-full bg-accent text-sm font-medium text-on-accent transition-colors hover:bg-accent-2 sm:w-auto sm:px-8"
          >
            Crea cliente
          </button>
        </form>
      </Card>
    </AdminShell>
  );
}
