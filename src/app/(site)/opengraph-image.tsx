import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const alt = "Quel prodotto che hai in mente non richiede un'agenzia. Marcelo Amaro, Fentriq";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#08090B",
          color: "#F4F6F8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ fontSize: 34, fontWeight: 300 }}>{siteConfig.name}</div>
          <svg width={190} height={133} viewBox="6 24 86 60">
            <path d="M26 30 L56 30 L42 54 L12 54 Z" fill="#4F5BF7" />
            <path d="M56 30 L86 30 L72 54 L42 54 Z" fill="#AEB4C2" />
            <path d="M42 54 L72 54 L58 78 L28 78 Z" fill="#F4F6F8" />
            <path d="M58 78 L72 54 L86 54 L72 78 Z" fill="#8A6CFF" />
          </svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 74, lineHeight: 1.05, letterSpacing: -2.5 }}>
          <div style={{ display: "flex", color: "#8B90A0" }}>Quel prodotto che hai in mente</div>
          <div style={{ display: "flex", fontWeight: 700 }}>non richiede un&apos;agenzia.</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, color: "#A2A8B6" }}>
          <div style={{ display: "flex" }}>{siteConfig.owner}</div>
          <div style={{ display: "flex" }}>{siteConfig.domain}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
