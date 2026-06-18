import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---- Minimal in-memory rate limiter (per IP, sliding window) ------------- //
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic cleanup to avoid unbounded growth.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t > WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_REQUESTS;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation" },
      { status: 400 },
    );
  }

  // Honeypot: a filled `website` field means a bot. Pretend success.
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const { website: _hp, consent: _c, ...clean } = parsed.data;
  void _hp;
  void _c;

  const payload = {
    ...clean,
    locale: clean.locale ?? "it",
    ts: new Date().toISOString(),
    source: "fentriq.app",
    ip,
  };

  // 1) Primary: fire the n8n webhook (the dogfooded automation).
  let delivered = false;
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const r = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!r.ok) throw new Error(`n8n responded ${r.status}`);
      delivered = true;
    } catch (err) {
      console.error("[contact] n8n webhook failed:", err);
    }
  }

  // 2) Fallback: send a direct email via Resend so leads are never lost.
  if (!delivered) {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.LEAD_EMAIL;
    if (apiKey && to) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: process.env.RESEND_FROM ?? "web@fentriq.app",
          to,
          replyTo: payload.email,
          subject: `Nuovo lead: ${payload.name}${payload.company ? ` (${payload.company})` : ""}`,
          text: [
            `Nome: ${payload.name}`,
            `Email: ${payload.email}`,
            `Azienda: ${payload.company || "—"}`,
            `Budget: ${payload.budget || "—"}`,
            `Lingua: ${payload.locale}`,
            "",
            payload.message,
            "",
            `— ${payload.ts} · ${payload.source}`,
          ].join("\n"),
        });
        delivered = true;
      } catch (err) {
        console.error("[contact] Resend fallback failed:", err);
      }
    }
  }

  if (!delivered) {
    // Both channels unconfigured/failed — surface an error so the UI can
    // offer WhatsApp as a manual fallback.
    return NextResponse.json(
      { ok: false, error: "delivery_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
