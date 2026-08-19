import { cookies } from "next/headers";

/**
 * Single-operator auth for /admin: one password, one signed cookie.
 *
 * There is exactly one user (the studio owner), so there is no user table.
 * The cookie carries an expiry and an HMAC over it, so it cannot be forged
 * without ADMIN_SECRET, and it is HttpOnly + SameSite=Lax so it cannot be
 * read by scripts or sent from another site.
 */

const COOKIE = "fentriq_admin";
const MAX_AGE_S = 60 * 60 * 24 * 30; // 30 days — it is a phone-in-pocket tool

function secret(): string {
  const s = process.env.ADMIN_SECRET ?? process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_SECRET (or ADMIN_PASSWORD) is not set");
  return s;
}

export function isAuthEnabled(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function b64url(bytes: ArrayBuffer): string {
  return Buffer.from(bytes).toString("base64url");
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return b64url(mac);
}

/** Constant-time-ish comparison, to avoid leaking the signature byte by byte. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyPassword(candidate: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(candidate, expected);
}

export async function createSession(): Promise<void> {
  const exp = String(Date.now() + MAX_AGE_S * 1000);
  const value = `${exp}.${await sign(exp)}`;
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: MAX_AGE_S,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function isLoggedIn(): Promise<boolean> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;
  const [exp, mac] = raw.split(".");
  if (!exp || !mac) return false;
  if (Number(exp) < Date.now()) return false;
  try {
    return safeEqual(mac, await sign(exp));
  } catch {
    return false;
  }
}
