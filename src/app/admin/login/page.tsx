"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginPage() {
  const [error, action, pending] = useActionState(login, null);

  return (
    <main className="flex min-h-dvh items-center justify-center px-5">
      <form action={action} className="w-full max-w-sm">
        <div className="flex items-center gap-3">
          <span aria-hidden className="block h-2.5 w-2.5 rounded-full bg-accent" />
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Fentriq · Admin
          </p>
        </div>
        <h1 className="mt-5 text-3xl font-bold">Accesso</h1>
        <p className="mt-2 text-sm text-muted">
          Area privata. Solo per lo studio.
        </p>

        <label htmlFor="password" className="mt-8 block text-sm text-muted">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          autoComplete="current-password"
          className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-text outline-none focus:border-accent/60"
        />

        {error ? (
          <p role="alert" className="mt-3 text-sm text-red-400">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 h-12 w-full rounded-full bg-accent font-medium text-on-accent transition-colors hover:bg-accent-2 disabled:opacity-60"
        >
          {pending ? "Un attimo…" : "Entra"}
        </button>
      </form>
    </main>
  );
}
