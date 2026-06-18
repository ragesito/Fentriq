# Fentriq

Sito web dello studio di sviluppo software **Fentriq** — landing dark, bilingue
(IT/EN), ottimizzata per la conversione (prenota call → form → WhatsApp).

Costruita con **Next.js 16 (App Router) · TypeScript · Tailwind v4 · next-intl ·
Framer Motion**. Static-first: tutto prerenderizzato tranne `/api/contact`.

## Avvio rapido

```bash
npm install
cp .env.example .env.local   # compila le variabili
npm run dev                  # http://localhost:3000
```

Comandi:

```bash
npm run dev        # sviluppo
npm run build      # build di produzione
npm run start      # serve la build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Variabili d'ambiente

Vedi [`.env.example`](.env.example). Nessuna è obbligatoria per buildare; in
produzione configura almeno:

| Variabile | Scopo |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canonico (sitemap, OG, JSON-LD) |
| `NEXT_PUBLIC_CALCOM_LINK` | slug Cal.com, es. `fentriq/discovery` |
| `NEXT_PUBLIC_WHATSAPP` | numero E.164 senza `+`, es. `39333…` |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | dominio Plausible (vuoto = analytics off) |
| `N8N_WEBHOOK_URL` | webhook n8n che riceve ogni lead |
| `RESEND_API_KEY` / `RESEND_FROM` / `LEAD_EMAIL` | fallback email se n8n è giù |

## Lead pipeline (il dogfooding)

`Form → POST /api/contact` → validazione Zod + honeypot + rate-limit per IP →
**webhook n8n** (primario) → **Resend** (fallback se il webhook fallisce). Se
entrambi i canali non sono configurati l'API risponde `502` e la UI propone
WhatsApp. Configura il flusso n8n: Webhook → Telegram → Resend auto-reply →
Google Sheets.

## Struttura

```
src/
├─ app/[locale]/        # pagine localizzate (home, lavori, contatti, legal)
│  ├─ opengraph-image.tsx
│  └─ ...
├─ app/api/contact/     # route handler del form
├─ app/{sitemap,robots}.ts
├─ components/ui/        # primitive (Button, Card, Section, …)
├─ components/sections/  # sezioni (Hero, Services, Work, ContactForm, …)
├─ content/             # work.ts (casi studio) · legal.ts
├─ messages/            # it.json · en.json (tutto il copy)
├─ config/site.ts       # nav, contatti, link
├─ i18n/                # routing, navigation, request (next-intl)
├─ lib/                 # cn, analytics, contact-schema
└─ proxy.ts             # middleware i18n (Next 16 "proxy")
public/brand/           # logo SVG · public/work/ cover
```

## Da completare prima del lancio

- [ ] **Copy italiano**: revisione da parte di un madrelingua.
- [ ] **P.IVA** reale in `src/config/site.ts` (`vatNumber`).
- [ ] **Numero WhatsApp**, **slug Cal.com**, **email** reali.
- [ ] Verifica del dominio su **Resend** per inviare da `@fentriq.app`.
- [ ] Configura il **flusso n8n** e imposta `N8N_WEBHOOK_URL`.
- [ ] Cover reali dei progetti in `public/work/` (ora placeholder generati).
- [ ] Deploy su **Vercel** + dominio `fentriq.app`.

## Deploy

```bash
npx vercel        # preview
npx vercel --prod # produzione
```
Imposta le variabili d'ambiente nel dashboard Vercel.
