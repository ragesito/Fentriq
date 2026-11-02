"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site";
import { homeCopy, type Locale } from "@/content/home";
import { cookieDoc, privacyDoc, type LegalDoc } from "@/content/legal";
import { createDrop, dropSupported, type Drop, type Point } from "./drop";
import type { SceneState } from "./scene";

const PANELS = ["scrivimi", "come-lavoro", "chiama", "email", "privacy", "cookie"] as const;
type Panel = (typeof PANELS)[number];
type SendStatus = "idle" | "sending" | "sent" | "contact" | "rate" | "failed";

const LANG_KEY = "fq-lang";
const CLOSE_MS = 420;
const PHONE_QUERY = "(max-width: 820px)";
const ENTERED_KEY = "fq-entered";
// Long enough to see the metal form and catch the light. By ENTRY_CAP the page opens
// even if the 3D is late: the still holds the logo's place until it arrives.
const ENTRY_HOLD = 1300;
const ENTRY_CAP = 2600;
const ENTRY_OUT = 1200;

function panelFromHash(): Panel | null {
  const name = location.hash.slice(1);
  return (PANELS as readonly string[]).includes(name) ? (name as Panel) : null;
}

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

function CopyButton({ value, label, done }: { value: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="ghost"
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
    >
      {copied ? done : label}
    </button>
  );
}

function LegalBody({ doc, locale, updated }: { doc: LegalDoc; locale: Locale; updated: string }) {
  return (
    <>
      <div className="legal-cols">
        {doc.blocks[locale].map((block) => (
          <div className="legal-block" key={block.heading}>
            <h3>{block.heading}</h3>
            {block.body.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        ))}
      </div>
      <p className="note">{updated}</p>
    </>
  );
}

export function Home() {
  const [locale, setLocale] = useState<Locale>("it");
  const [panel, setPanel] = useState<Panel | null>(null);
  // The last open panel: its content stays in place while the drawer leaves.
  const [shown, setShown] = useState<Panel | null>(null);
  if (panel && panel !== shown) setShown(panel);
  const [ask, setAsk] = useState("");
  const [ideaIndex, setIdeaIndex] = useState(0);
  const [askFocused, setAskFocused] = useState(false);
  const [form, setForm] = useState({ message: "", name: "", contact: "", website: "" });
  const [status, setStatus] = useState<SendStatus>("idle");
  const [sceneMode, setSceneMode] = useState<"loading" | "ready" | "flat">("loading");

  const drawer = useRef<HTMLDialogElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const sceneState = useRef<SceneState>({ open: false, entering: true });
  const entered = useRef(false);
  const openedHere = useRef(false);
  const drop = useRef<Drop | null>(null);
  const lastTap = useRef<Point | null>(null);
  const t = homeCopy[locale];

  // The language lives on this one address: it never changes the URL, so the
  // page Google indexes stays Italian and nothing reloads.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LANG_KEY);
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only preference, unknown during prerender
    if (saved === "en") setLocale("en");
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const chooseLocale = (next: Locale) => {
    setLocale(next);
    setIdeaIndex(0);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {}
  };

  // The hash drives the drawer, so links, the back button and shared URLs all work.
  useEffect(() => {
    const sync = () => setPanel(panelFromHash());
    const onHash = () => {
      const next = panelFromHash();
      openedHere.current = next !== null;
      if (next === "scrivimi") setStatus((s) => (s === "sent" ? "idle" : s));
      sync();
    };
    const onTap = (e: PointerEvent) => {
      lastTap.current = { x: e.clientX, y: e.clientY };
    };
    sync();
    addEventListener("hashchange", onHash);
    addEventListener("pointerdown", onTap, { passive: true });
    return () => {
      removeEventListener("hashchange", onHash);
      removeEventListener("pointerdown", onTap);
    };
  }, []);

  const leave = useCallback(() => {
    if (openedHere.current) {
      openedHere.current = false;
      history.back();
    } else {
      history.replaceState(null, "", location.pathname + location.search);
      setPanel(null);
    }
  }, []);

  useEffect(() => {
    const d = drawer.current;
    if (!d) return;
    const isOpen = panel !== null;
    document.body.classList.toggle("panel-open", isOpen);
    sceneState.current.open = isOpen;
    // On phones the card opens as a drop.
    const phone = matchMedia(PHONE_QUERY).matches;
    const phoneDrop = phone && dropSupported();
    if (phoneDrop) drop.current ??= createDrop(d);
    if (!isOpen) {
      d.classList.remove("in");
      if (phoneDrop) {
        drop.current?.play(0, null, () => {
          if (d.open) d.close();
        });
        return () => drop.current?.stop();
      }
      const timer = setTimeout(() => {
        if (d.open) d.close();
      }, CLOSE_MS);
      return () => clearTimeout(timer);
    }
    if (!d.open) {
      d.showModal();
      d.scrollTop = 0;
    }
    if (phoneDrop) drop.current?.play(1, lastTap.current);
    lastTap.current = null;
    const raf = requestAnimationFrame(() => d.classList.add("in"));
    if (panel === "scrivimi") {
      const typed = ask.trim();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- carries the hero's text into the form as it opens
      if (typed) setForm((f) => (f.message ? f : { ...f, message: typed }));
    }
    // On phones a focused field would throw the keyboard over the card right away.
    if (panel === "scrivimi" && !phone) {
      document.getElementById(ask.trim() ? "w-name" : "w-idea")?.focus();
    } else {
      d.querySelector<HTMLElement>(`[data-panel="${panel}"] h2`)?.focus({ preventScroll: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      drop.current?.stop();
    };
    // `ask` is read only at the moment the drawer opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panel]);

  // The examples only rotate while nobody is using the field.
  const askIdle = !askFocused && !ask;
  useEffect(() => {
    if (!askIdle || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIdeaIndex((i) => i + 1), 3600);
    return () => clearInterval(id);
  }, [askIdle]);

  // The entrance opens once the 3D is ready, timed from the start of the page load.
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("no-entry")) sceneState.current.entering = false;
    if (!sceneState.current.entering || entered.current) return;
    const open = () => {
      entered.current = true;
      root.classList.add("open", "enter");
      setTimeout(() => {
        root.classList.add("done");
        sceneState.current.entering = false;
      }, ENTRY_OUT + 80);
      try {
        sessionStorage.setItem(ENTERED_KEY, "1");
      } catch {}
    };
    const until = sceneMode === "loading" ? ENTRY_CAP : ENTRY_HOLD;
    const timer = setTimeout(open, Math.max(0, until - performance.now()));
    return () => clearTimeout(timer);
  }, [sceneMode]);

  // 3D comes in after the first paint: the text is never waiting for it.
  useEffect(() => {
    let alive = true;
    let stop: (() => void) | null = null;
    const timer = setTimeout(() => {
      import("./scene")
        .then(({ startScene }) => {
          if (!alive || !canvas.current) return;
          stop = startScene(canvas.current, sceneState.current, () => setSceneMode("ready"));
          if (!stop) setSceneMode("flat");
        })
        .catch(() => setSceneMode("flat"));
    }, 60);
    return () => {
      alive = false;
      clearTimeout(timer);
      stop?.();
    };
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ message: "", name: "", contact: "", website: "" });
        setAsk("");
        window.plausible?.("form_submit");
      } else if (res.status === 400) setStatus("contact");
      else if (res.status === 429) setStatus("rate");
      else setStatus("failed");
    } catch {
      setStatus("failed");
    }
  };

  const errorText =
    status === "contact" ? t.errContact : status === "rate" ? t.errRate : status === "failed" ? t.errSend : null;
  const idea = t.ideas[ideaIndex % t.ideas.length];
  const lastIdea = t.ideas[(ideaIndex + t.ideas.length - 1) % t.ideas.length];

  return (
    <>
      <canvas
        ref={canvas}
        id="scene"
        className={sceneMode === "ready" ? "ready" : undefined}
        aria-hidden="true"
      />
      <div id="still" aria-hidden="true" />
      <div className="film" aria-hidden="true" />

      <div className="ui">
        <header className="top">
          <span className="word">{siteConfig.name}</span>
          <div className="top-right">
            {(["it", "en"] as const).map((code, i) => (
              <span key={code}>
                {i > 0 ? <span aria-hidden="true"> / </span> : null}
                <button
                  className="lang"
                  type="button"
                  aria-pressed={locale === code}
                  onClick={() => chooseLocale(code)}
                >
                  {code.toUpperCase()}
                </button>
              </span>
            ))}
          </div>
        </header>

        <main className="stage">
          <div>
            <h1>
              <span className="quiet">{t.h1a}</span> <span className="quiet">{t.h1b}</span>{" "}
              <span>{t.h1c}</span> <span>{t.h1d}</span>
            </h1>
            <p className="lede">{t.lede}</p>
            <form
              className="ask"
              onSubmit={(e) => {
                e.preventDefault();
                location.hash = "scrivimi";
              }}
            >
              <label htmlFor="ask-input" className="sr">
                {t.askLabel}
              </label>
              <input
                id="ask-input"
                type="text"
                autoComplete="off"
                value={ask}
                onChange={(e) => setAsk(e.target.value)}
                onFocus={() => setAskFocused(true)}
                onBlur={() => setAskFocused(false)}
              />
              {/* Not a native placeholder: those can't animate from one text to the next. */}
              {ask ? null : (
                <span className="ask-hint" aria-hidden="true">
                  {ideaIndex > 0 ? (
                    <span key={`out-${ideaIndex}`} className="hint-out">
                      {lastIdea}
                    </span>
                  ) : null}
                  <span key={`in-${ideaIndex}`} className={ideaIndex > 0 ? "hint-in" : undefined}>
                    {idea}
                  </span>
                </span>
              )}
              <button type="submit" aria-label={t.askSend}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3 10h13M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </button>
            </form>
          </div>

          <aside className="side">
            <div className="sign">
              <strong>{siteConfig.owner}</strong>
              <small>{t.reply}</small>
            </div>
            <a className="how-line" href="#come-lavoro">
              {t.howLine}
            </a>
            <nav className="acts" aria-label={t.actsLabel}>
              <a href="#come-lavoro">
                <span>{t.actHow}</span>
                <i>{t.actHowSub}</i>
              </a>
              <a href="#chiama">
                <span>{t.actCall}</span>
                <i>{t.actCallSub}</i>
              </a>
              <a href="#email">
                <span>Email</span>
                <i>{siteConfig.email}</i>
              </a>
            </nav>
          </aside>
        </main>

        <footer className="foot">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <span>
            <a href="#privacy">Privacy</a> · <a href="#cookie">Cookie</a>
          </span>
        </footer>
      </div>

      <div id="cover" aria-hidden="true">
        <div className="cover-block">
          <i className="s1" />
          <i className="s2" />
          <i className="s3" />
          <i className="s4" />
          <div className="cover-field">
            <div className="cover-wall" />
            <div className="cover-logo">
              <div className="cover-reveal">
                <div className="cover-unskew">
                  <div className="cover-shade" />
                  <div className="cover-metal" />
                  <div className="cover-sheen">
                    <div className="cover-band" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <dialog
        ref={drawer}
        className="drawer"
        aria-labelledby={shown ? `title-${shown}` : undefined}
        data-size={
          shown === "privacy" ? "wide" : shown === "chiama" || shown === "email" ? "small" : undefined
        }
        onCancel={(e) => {
          e.preventDefault();
          leave();
        }}
        onClick={(e) => {
          if (e.target === drawer.current) leave();
        }}
      >
        <div className="drawer-inner">
          <button className="close" type="button" aria-label={t.close} onClick={leave}>
            <CloseIcon />
          </button>

          <section data-panel="scrivimi" hidden={shown !== "scrivimi"}>
            <h2 id="title-scrivimi" tabIndex={-1}>
              {status === "sent" ? t.sentTitle : t.writeTitle}
            </h2>
            {status === "sent" ? (
              <p role="status">{t.sentText}</p>
            ) : (
              <>
                <p>{t.writeLede}</p>
                <form onSubmit={submit}>
                  <label htmlFor="w-idea">
                    <span>{t.wIdea}</span>
                    <small>{t.wIdeaHelp}</small>
                  </label>
                  <textarea
                    className="field"
                    id="w-idea"
                    required
                    minLength={3}
                    maxLength={4000}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                  <label htmlFor="w-name">
                    <span>{t.wName}</span>
                  </label>
                  <input
                    className="field"
                    id="w-name"
                    type="text"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={120}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <label htmlFor="w-back">
                    <span>{t.wBack}</span>
                    <small>{t.wBackHelp}</small>
                  </label>
                  <input
                    className="field"
                    id="w-back"
                    type="text"
                    required
                    maxLength={200}
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  />
                  {/* Honeypot: hidden from people, tempting for bots. */}
                  <input
                    className="trap"
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                  />
                  {errorText ? (
                    <p className="err" role="alert">
                      {errorText}
                    </p>
                  ) : null}
                  <button className="send" type="submit" disabled={status === "sending"}>
                    <span>{status === "sending" ? t.wSending : t.wSend}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                  <p className="note">
                    {t.wNote}{" "}
                    <a
                      href="#privacy"
                      onClick={(e) => {
                        e.preventDefault();
                        location.replace("#privacy");
                      }}
                    >
                      {t.wNoteLink}
                    </a>
                    .
                  </p>
                </form>
              </>
            )}
          </section>

          <section data-panel="come-lavoro" hidden={shown !== "come-lavoro"}>
            <h2 id="title-come-lavoro" tabIndex={-1}>
              {t.howTitle}
            </h2>
            <p>{t.howLede}</p>
            <ul className="inside">
              {t.how.map((item) => (
                <li key={item.t}>
                  <b>{item.t}</b>
                  <span>{item.d}</span>
                </li>
              ))}
            </ul>
            <a
              className="send"
              href="#scrivimi"
              onClick={(e) => {
                e.preventDefault();
                location.replace("#scrivimi");
              }}
            >
              <span>{t.howCta}</span>
              <span aria-hidden="true">→</span>
            </a>
          </section>

          <section data-panel="chiama" hidden={shown !== "chiama"}>
            <h2 id="title-chiama" tabIndex={-1}>
              {t.callTitle}
            </h2>
            <p>{t.callLede}</p>
            <a className="big" href={`tel:${siteConfig.phone.e164}`}>
              {siteConfig.phone.display}
            </a>
            <CopyButton value={siteConfig.phone.display} label={t.callCopy} done={t.copied} />
          </section>

          <section data-panel="email" hidden={shown !== "email"}>
            <h2 id="title-email" tabIndex={-1}>
              {t.mailTitle}
            </h2>
            <p>{t.mailLede}</p>
            <a className="big" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            <CopyButton value={siteConfig.email} label={t.mailCopy} done={t.copied} />
          </section>

          <section data-panel="privacy" hidden={shown !== "privacy"}>
            <h2 id="title-privacy" tabIndex={-1}>
              {privacyDoc.title[locale]}
            </h2>
            <LegalBody doc={privacyDoc} locale={locale} updated={t.updated} />
          </section>

          <section data-panel="cookie" hidden={shown !== "cookie"}>
            <h2 id="title-cookie" tabIndex={-1}>
              {cookieDoc.title[locale]}
            </h2>
            <LegalBody doc={cookieDoc} locale={locale} updated={t.updated} />
          </section>
        </div>
      </dialog>
    </>
  );
}

declare global {
  interface Window {
    plausible?: (event: string) => void;
  }
}
