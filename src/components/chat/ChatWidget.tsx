"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageSquare, X, SendHorizontal, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { CalButton } from "@/components/ui/CalButton";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export const OPEN_CHAT_EVENT = "fentriq:open-chat";

// Conversation is kept in sessionStorage: survives reloads and in-site
// navigation within the same tab, and is cleared when the tab closes.
const STORAGE_KEY = "fentriq:chat:v1";

export function ChatWidget() {
  const t = useTranslations("chat");
  const tc = useTranslations("common");
  const locale = useLocale();
  const reduce = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [errored, setErrored] = useState<null | "error" | "notConfigured">(null);
  const [hydrated, setHydrated] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const suggestions = (t.raw("suggestions") as string[]) ?? [];

  // Restore a prior conversation (same tab) on mount. Hydrating persisted
  // state must happen post-mount in an effect, otherwise the server-rendered
  // markup (empty/closed) wouldn't match the client — so the rule is waived here.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { open?: boolean; messages?: Msg[] };
        if (Array.isArray(saved.messages)) setMessages(saved.messages);
        if (saved.open) setOpen(true);
      }
    } catch {
      // Ignore corrupt/unavailable storage.
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist conversation + open state (only after the initial restore).
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ open, messages }));
    } catch {
      // Storage full or blocked — non-fatal.
    }
  }, [open, messages, hydrated]);

  const openChat = useCallback(() => {
    setOpen(true);
    trackEvent("chat_open");
  }, []);

  // Allow other components (CTA buttons) to open the chat.
  useEffect(() => {
    window.addEventListener(OPEN_CHAT_EVENT, openChat);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, openChat);
  }, [openChat]);

  // Focus the input whenever the panel opens.
  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, busy]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || busy) return;
      setErrored(null);
      setInput("");

      const next: Msg[] = [...messages, { role: "user", content }];
      setMessages([...next, { role: "assistant", content: "" }]);
      setBusy(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale, messages: next.slice(-20) }),
        });

        if (!res.ok || !res.body) {
          setErrored(res.status === 503 ? "notConfigured" : "error");
          setMessages(next); // drop the empty assistant bubble
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages([...next, { role: "assistant", content: acc }]);
        }
        if (!acc) {
          setErrored("error");
          setMessages(next);
        }
      } catch {
        setErrored("error");
        setMessages(next);
      } finally {
        setBusy(false);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    },
    [busy, locale, messages],
  );

  return (
    <>
      {/* Launcher */}
      <div
        className={cn(
          "fixed bottom-5 right-5 z-50",
          !open && "animate-float-bob",
        )}
      >
        {/* Pulsing rings (only when closed) */}
        {!open ? (
          <>
            <span
              aria-hidden
              className="animate-ping-slow absolute inset-0 rounded-full bg-accent/40"
            />
            <span
              aria-hidden
              className="animate-ping-slow absolute inset-0 rounded-full bg-accent-2/30 [animation-delay:-1.3s]"
            />
          </>
        ) : null}

        <button
          type="button"
          aria-label={open ? t("close") : t("open")}
          aria-expanded={open}
          onClick={() => (open ? setOpen(false) : openChat())}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-2))] text-on-accent shadow-[0_8px_30px_-4px_rgba(79,91,247,0.6)] ring-1 ring-white/10 transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {/* "Online" indicator (only when closed) */}
          {!open ? (
            <span aria-hidden className="absolute right-0.5 top-0.5 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-surface" />
            </span>
          ) : null}

          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "x" : "chat"}
              initial={{ opacity: 0, rotate: reduce ? 0 : -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: reduce ? 0 : 90, scale: 0.6 }}
              transition={{ duration: 0.18 }}
            >
              {open ? <X size={26} /> : <MessageSquare size={26} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={t("title")}
            initial={{ opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-5 z-50 flex max-h-[70vh] w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] sm:max-h-[600px]"
          >
            {/* Header */}
            <header className="flex items-center gap-3 border-b border-border bg-surface-2/60 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent ring-1 ring-inset ring-accent/25">
                <Sparkles size={18} aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold">
                  {t("title")}
                </p>
                <p className="truncate font-mono text-[0.65rem] uppercase tracking-[0.06em] text-muted">
                  {t("poweredBy")}
                </p>
              </div>
              <button
                type="button"
                aria-label={t("close")}
                onClick={() => setOpen(false)}
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:text-text"
              >
                <X size={18} />
              </button>
            </header>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              <Bubble role="assistant">{t("greeting")}</Bubble>

              {messages.map((m, i) => (
                <Bubble key={i} role={m.role}>
                  {m.content ||
                    (busy && i === messages.length - 1 ? <Dots /> : "")}
                </Bubble>
              ))}

              {errored ? (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {t(errored)}
                </div>
              ) : null}

              {messages.length === 0 && !errored ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/50 hover:text-text"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Composer */}
            <div className="border-t border-border bg-surface-2/40 p-3">
              {errored === "notConfigured" ? (
                <CalButton size="md" className="w-full" withIcon>
                  {tc("bookCall")}
                </CalButton>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="flex items-end gap-2"
                >
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send(input);
                      }
                    }}
                    rows={1}
                    maxLength={1500}
                    placeholder={t("placeholder")}
                    aria-label={t("placeholder")}
                    className="max-h-28 min-h-[2.5rem] flex-1 resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-muted/60 focus:border-accent/60 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={busy || !input.trim()}
                    aria-label={t("send")}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-on-accent transition-colors hover:bg-accent-2 disabled:opacity-50"
                  >
                    <SendHorizontal size={18} />
                  </button>
                </form>
              )}
              <p className="mt-2 text-center text-[0.65rem] text-muted/70">
                {t("disclaimer")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex",
        role === "user" ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
          role === "user"
            ? "bg-accent text-on-accent"
            : "bg-surface-2 text-text",
        )}
      >
        {children}
      </div>
    </div>
  );
}

function Dots() {
  return (
    <span className="inline-flex gap-1 py-1" aria-label="…">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
    </span>
  );
}
