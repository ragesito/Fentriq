import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { getClientCases } from "@/content/work";

export const runtime = "nodejs";
export const alt = "Fentriq — Studio di sviluppo software";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  it: {
    eyebrow: "Studio di sviluppo software",
    words: ["Costruiamo", "il", "software", "che", "fa", "crescere", "la", "tua", "impresa."],
    highlight: "crescere",
    proof: (n: number) => `${n} lavori per clienti reali`,
    stack: "Web · App · IA · Automazioni · Web3",
  },
  en: {
    eyebrow: "Software development studio",
    words: ["We", "build", "the", "software", "that", "grows", "your", "business."],
    highlight: "grows",
    proof: (n: number) => `${n} projects for real clients`,
    stack: "Web · Apps · AI · Automation · Web3",
  },
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = locale === "en" ? COPY.en : COPY.it;
  const clientCount = getClientCases().length;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0B0C0F",
          // Both glows live on the root so their bounding boxes can't band.
          backgroundImage:
            "radial-gradient(circle at 88% 0%, rgba(79,91,247,0.40) 0%, rgba(79,91,247,0) 55%), radial-gradient(circle at 2% 105%, rgba(138,108,255,0.28) 0%, rgba(138,108,255,0) 55%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: 72,
          }}
        >
          {/* Eyebrow + brand mark */}
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  width: 48,
                  height: 2,
                  background: "#4F5BF7",
                  marginRight: 16,
                }}
              />
              <div
                style={{
                  fontSize: 22,
                  letterSpacing: 3,
                  color: "#9CA3B2",
                  textTransform: "uppercase",
                }}
              >
                {c.eyebrow}
              </div>
            </div>

            <svg width={150} height={105} viewBox="6 24 86 60">
              <mask id="fold">
                <rect x="0" y="0" width="100" height="100" fill="#fff" />
                <path
                  d="M56 30 L42 54 L72 54 L58 78"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </mask>
              <g mask="url(#fold)">
                <path d="M26 30 L56 30 L42 54 L12 54 Z" fill="#4F5BF7" />
                <path d="M56 30 L86 30 L72 54 L42 54 Z" fill="#AEB4C2" />
                <path d="M42 54 L72 54 L58 78 L28 78 Z" fill="#F4F6F8" />
                <path d="M58 78 L72 54 L86 54 L72 78 Z" fill="#8A6CFF" />
              </g>
            </svg>
          </div>

          {/* Headline — words laid out individually so one can be accented */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              maxWidth: 1010,
              marginTop: 12,
            }}
          >
            {c.words.map((w, i) => (
              <div
                key={i}
                style={{
                  fontSize: 78,
                  fontWeight: 700,
                  letterSpacing: -2,
                  lineHeight: 1.14,
                  marginRight: 13,
                  color: w === c.highlight ? "#8A6CFF" : "#F4F6F8",
                }}
              >
                {w}
              </div>
            ))}
          </div>

          {/* Proof + domain */}
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 26px",
                borderRadius: 9999,
                border: "1px solid rgba(79,91,247,0.45)",
                background: "rgba(79,91,247,0.14)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 12,
                  height: 12,
                  borderRadius: 9999,
                  background: "#4F5BF7",
                  marginRight: 14,
                }}
              />
              <div style={{ fontSize: 26, color: "#F4F6F8" }}>
                {c.proof(clientCount)}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <div style={{ fontSize: 20, color: "#6B7280", letterSpacing: 2 }}>
                {c.stack.toUpperCase()}
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: "#4F5BF7",
                  marginTop: 8,
                }}
              >
                {siteConfig.domain}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
