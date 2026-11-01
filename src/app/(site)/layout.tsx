import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { siteConfig } from "@/config/site";
import { fontVariables } from "../fonts";
import "./home.css";

const title = "Fentriq | Studio di sviluppo software | Web, App, IA, Automazioni";
const description =
  "Quel prodotto che hai in mente non richiede un'agenzia. Siti, app, automazioni e intelligenza artificiale su misura, dall'idea al lancio. Rispondo ogni giorno.";

// Once a session, and never over a panel someone came straight to or for reduced motion.
const SKIP_ENTRANCE = `(function(){var r=document.documentElement;try{if(location.hash||sessionStorage.getItem("fq-entered")||matchMedia("(prefers-reduced-motion: reduce)").matches)r.classList.add("no-entry")}catch(e){r.classList.add("no-entry")}})()`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title,
  description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.owner }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title,
    description,
    url: siteConfig.url,
    locale: "it_IT",
  },
  twitter: { card: "summary_large_image", title, description },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      // Google picks the largest declared icon for search results, and wants
      // a multiple of 48px — keep every variant on the same dark mark.
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  // Fallback verification for Search Console when the DNS TXT record isn't
  // used. Set NEXT_PUBLIC_GOOGLE_VERIFICATION in Vercel; omitted when unset.
  verification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#08090B",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Decided before the first paint, so a repeat visit never flashes the entrance. */}
        <script dangerouslySetInnerHTML={{ __html: SKIP_ENTRANCE }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: "#cover{display:none}" }} />
        </noscript>
        <link rel="preload" as="image" type="image/webp" href="/brand/fentriq-metal.webp" fetchPriority="high" />
        <link rel="preload" as="image" type="image/webp" href="/brand/fentriq-wall.webp" fetchPriority="high" />
      </head>
      <body>
        {children}
        {siteConfig.plausibleDomain ? (
          <Script
            defer
            data-domain={siteConfig.plausibleDomain}
            src="https://plausible.io/js/script.tagged-events.js"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
