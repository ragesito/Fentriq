# Fentriq

The site of **Fentriq**, Marcelo Amaro's software practice. It is one page at one
address: nothing reloads, and everything the visitor asks for opens in a drawer
over the same 3D scene.

**Live:** [fentriq.app](https://fentriq.app)

## How it is built

- **Next.js 16** (App Router) with a statically prerendered home
- **Three.js** scene loaded after first paint, so the text never waits for it
- **Drawers driven by the URL hash** (`#scrivimi`, `#come-lavoro`, `#chiama`,
  `#email`, `#privacy`, `#cookie`), so links and the back button work
- **Italian and English on the same address**: Italian is what gets indexed,
  and the visitor's choice is remembered in their browser
- **Contact form** with Zod validation, honeypot and rate limit, delivered by
  Resend email and an n8n webhook
- **`/admin`**: the private client and payments tool, in its own root layout

Every address from the previous multi-page site redirects to the home
(`next.config.ts`).

## Layout

```
src/app/(site)/        home: layout, page, styles, OpenGraph image
src/app/admin/         private admin
src/app/api/contact/   contact form endpoint
src/components/home/   the page and the 3D scene
src/content/           page copy (IT/EN) and legal text
src/config/site.ts     name, contacts, socials
```

## Development

```bash
npm install
cp .env.example .env.local   # if available; see the variables below
npm run dev
```

Other commands: `npm run build`, `npm run lint`, `npm run typecheck`.

Environment variables: `RESEND_API_KEY`, `RESEND_FROM`, `LEAD_EMAIL`,
`N8N_WEBHOOK_URL`, `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, `ADMIN_PASSWORD`,
`ADMIN_SECRET`.

Hosted on Vercel, which deploys `main` automatically.

## License

See [LICENSE](LICENSE).
