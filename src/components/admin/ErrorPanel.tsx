/**
 * A readable failure instead of Next's generic 500.
 *
 * This tool is operated by one person with no access to server logs on a
 * phone, so when the database call fails the screen has to say what broke.
 * Connection strings carry credentials, so anything URL-shaped is scrubbed
 * before the message is rendered.
 */
export function ErrorPanel({ error }: { error: unknown }) {
  const raw = error instanceof Error ? error.message : String(error);
  const safe = raw
    .replace(/postgres(?:ql)?:\/\/[^\s'"]+/gi, "postgresql://…(oculto)")
    .replace(/([?&](?:password|sslmode|options)=)[^\s&'"]+/gi, "$1…");

  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
        Fentriq · Admin
      </p>
      <h1 className="mt-4 text-2xl font-bold">La base de datos no responde</h1>
      <p className="mt-4 text-muted">
        Las variables están puestas, pero la conexión falló. Mensaje exacto:
      </p>
      <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface p-4 text-sm text-red-300">
        {safe}
      </pre>
      <ul className="mt-6 space-y-2 text-sm text-muted">
        <li>
          Comprueba que <code className="text-text">DATABASE_URL</code> sea solo la
          cadena que empieza por <code className="text-text">postgresql://</code> —
          sin <code className="text-text">psql</code> delante y sin comillas.
        </li>
        <li>En Neon, copia la cadena del recuadro «Connection string».</li>
        <li>Después de cambiarla en Vercel hace falta un nuevo despliegue.</li>
      </ul>
    </div>
  );
}
