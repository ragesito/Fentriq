"use client";

import { useState } from "react";

/** Copies the WhatsApp message with one tap — the whole point on a phone. */
export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {
          setDone(false);
        }
      }}
      className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-2"
    >
      {done ? "Copiado ✓" : "Copiar el mensaje"}
    </button>
  );
}
