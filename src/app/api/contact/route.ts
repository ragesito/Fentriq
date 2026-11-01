import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema, isEmail } from "@/lib/contact-schema";

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

  const { name, contact, message, locale } = parsed.data;
  const replyByEmail = isEmail(contact);
  const payload = {
    name,
    email: replyByEmail ? contact : "",
    phone: replyByEmail ? "" : contact,
    message,
    locale: locale ?? "it",
    ts: new Date().toISOString(),
    source: "fentriq.app",
    ip,
  };

  // Email goes out directly, and the n8n webhook gets the same lead. Either
  // one arriving is enough: a phone-only lead has no email for n8n to rely on,
  // so it can't be the only channel.
  async function sendEmail(): Promise<boolean> {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.LEAD_EMAIL;
    if (!apiKey || !to) return false;
    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM ?? "Fentriq <info@fentriq.app>",
        to,
        replyTo: replyByEmail ? contact : undefined,
        subject: `Nuovo messaggio: ${name}`,
        text: [
          `Nome: ${name}`,
          `Dove rispondere: ${contact}`,
          `Lingua: ${payload.locale}`,
          "",
          message,
          "",
          `— ${payload.ts} · ${payload.source}`,
        ].join("\n"),
      });
      if (error) throw new Error(error.message);
      return true;
    } catch (err) {
      console.error("[contact] Resend failed:", err);
      return false;
    }
  }

  async function callWebhook(): Promise<boolean> {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) return false;
    try {
      const r = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) throw new Error(`n8n responded ${r.status}`);
      return true;
    } catch (err) {
      console.error("[contact] n8n webhook failed:", err);
      return false;
    }
  }

  const [emailed, hooked] = await Promise.all([sendEmail(), callWebhook()]);

  if (!emailed && !hooked) {
    // Both channels unconfigured/failed — surface an error so the UI can
    // point the visitor to the email address and the phone number.
    return NextResponse.json(
      { ok: false, error: "delivery_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
