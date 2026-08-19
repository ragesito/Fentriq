import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin · Fentriq",
  // Private tool: never index, never follow, never show in any listing.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The admin lives outside the [locale] tree on purpose: it is a single-operator
 * tool in Italian only, and keeping it out of next-intl means no locale
 * prefixes, no message loading and no chance of it leaking into the sitemap.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="min-h-dvh bg-bg text-text antialiased">{children}</body>
    </html>
  );
}
