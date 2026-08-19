import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin · Fentriq",
  // Private tool: never index, never follow, never show in any listing.
  robots: { index: false, follow: false, nocache: true },
  // Declared here too, even though nobody bookmarks the admin: this is a
  // second root layout, and a page on the origin that declares no icon makes
  // the browser drop the one it cached for the marketing site.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

/**
 * The admin lives outside the [locale] tree on purpose: it is a single-operator
 * tool in Spanish only, and keeping it out of next-intl means no locale
 * prefixes, no message loading and no chance of it leaking into the sitemap.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-bg text-text antialiased">{children}</body>
    </html>
  );
}
