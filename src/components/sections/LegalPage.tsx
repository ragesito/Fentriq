import { Container } from "@/components/ui/Container";
import type { LegalDoc } from "@/content/legal";
import type { Locale } from "@/i18n/routing";

export function LegalPage({
  doc,
  locale,
  updatedLabel,
}: {
  doc: LegalDoc;
  locale: Locale;
  updatedLabel: string;
}) {
  const updated = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(new Date(doc.updated));

  return (
    <article className="py-28">
      <Container className="max-w-3xl">
        <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-bold">
          {doc.title[locale]}
        </h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.08em] text-muted">
          {updatedLabel}: {updated}
        </p>

        <div className="mt-12 space-y-10">
          {doc.blocks[locale].map((block) => (
            <section key={block.heading}>
              <h2 className="text-xl font-semibold">{block.heading}</h2>
              <div className="mt-3 space-y-3">
                {block.body.map((p, i) => (
                  <p key={i} className="leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </article>
  );
}
