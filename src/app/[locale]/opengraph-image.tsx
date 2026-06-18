import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const alt = "Fentriq — Studio di sviluppo software";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tagline =
    locale === "en"
      ? "Web · Apps · AI · Automation · Web3"
      : "Web · App · IA · Automazioni · Web3";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0C0F",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Folded-band facets */}
        <div style={{ display: "flex", gap: 0 }}>
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "56px solid transparent",
              borderBottom: "56px solid transparent",
              borderLeft: "44px solid #4F5BF7",
            }}
          />
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "56px solid transparent",
              borderBottom: "56px solid transparent",
              borderLeft: "44px solid #8A6CFF",
            }}
          />
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "56px solid transparent",
              borderBottom: "56px solid transparent",
              borderLeft: "44px solid #AEB4C2",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 120,
              fontWeight: 700,
              color: "#F4F6F8",
              letterSpacing: "-4px",
            }}
          >
            Fentriq
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 40,
              color: "#9CA3B2",
              maxWidth: 900,
              lineHeight: 1.3,
            }}
          >
            {locale === "en"
              ? "We build the software that helps your business grow."
              : "Costruiamo il software che fa crescere la tua impresa."}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#9CA3B2",
            fontSize: 26,
            letterSpacing: "2px",
          }}
        >
          <span>{tagline.toUpperCase()}</span>
          <span style={{ color: "#4F5BF7" }}>{siteConfig.domain}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
