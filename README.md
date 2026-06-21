# Fentriq

Marketing site for **Fentriq**, a full-stack software studio for Italian SMEs.
Dark, bilingual (Italian / English), conversion-focused (book a call → contact
form → AI assistant), and static-first for speed.

🔗 **Live:** [fentriq.app](https://fentriq.app)

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- ⚡ **Static-first** Next.js (App Router) — everything prerendered except the API routes
- 🌍 **Bilingual** (IT default + EN) via `next-intl`, locale-aware routing & SEO
- 🤖 **AI assistant** — streaming chat (OpenAI) grounded in the studio's offering
- 📥 **Lead pipeline** — contact form with Zod validation, honeypot and rate-limit,
  delivered via an n8n webhook with a Resend email fallback
- 📅 **Cal.com** booking integration
- 🎬 **Product showcase reel** built with [Remotion](https://remotion.dev) (code → MP4)
- 🔎 **SEO** — metadata, OpenGraph image (`next/og`), JSON-LD, sitemap, robots, hreflang
- 🎨 Signature "folded band" brand system, custom motion, `prefers-reduced-motion` aware

## Tech stack

Next.js 16 · TypeScript · Tailwind CSS v4 · next-intl · Framer Motion ·
React Hook Form + Zod · Resend · OpenAI · Remotion

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values you need
npm run dev                  # http://localhost:3000
```

Scripts: `dev` · `build` · `start` · `lint` · `typecheck`

## Environment variables

See [`.env.example`](.env.example). None are required to build; in production set:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (sitemap, OG, JSON-LD) |
| `NEXT_PUBLIC_CALCOM_LINK` / `NEXT_PUBLIC_CALCOM_ORIGIN` | Cal.com booking slug + region |
| `OPENAI_API_KEY` / `OPENAI_MODEL` | AI chat assistant |
| `RESEND_API_KEY` / `RESEND_FROM` / `LEAD_EMAIL` | Email delivery for leads |
| `N8N_WEBHOOK_URL` | Lead automation webhook (optional) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Analytics (optional) |

## Project structure

```
src/
├─ app/[locale]/        # localized pages (home, work, contact, legal)
├─ app/api/             # contact + chat route handlers
├─ components/          # ui primitives, sections, chat widget
├─ content/             # case studies + legal copy (typed, bilingual)
├─ messages/            # it.json · en.json (all copy)
├─ config/ · i18n/ · lib/
public/                 # brand assets, case covers, showcase.mp4
video/                  # Remotion workspace for the showcase reel
```

## The showcase video

The home reel is a Remotion composition in [`video/`](video/). To work on it:

```bash
cd video
npm install
npm run studio          # preview/edit in the browser
npm run render          # render out/showcase.mp4
```

## License

Source code is released under the [MIT License](LICENSE).

> The **Fentriq** name, logo and brand assets are **not** covered by the license
> and remain the property of Fentriq — please don't reuse them to represent your
> own project.
