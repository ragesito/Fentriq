import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // The site is one page: every address it used to have lands on it, with
      // permanent redirects so search engines move their signals to the home.
      { source: "/contatti", destination: "/#scrivimi", permanent: true },
      { source: "/en/contatti", destination: "/#scrivimi", permanent: true },
      { source: "/privacy", destination: "/#privacy", permanent: true },
      { source: "/en/privacy", destination: "/#privacy", permanent: true },
      { source: "/cookie", destination: "/#cookie", permanent: true },
      { source: "/en/cookie", destination: "/#cookie", permanent: true },
      { source: "/formula", destination: "/", permanent: true },
      { source: "/lavori", destination: "/", permanent: true },
      { source: "/lavori/:slug", destination: "/", permanent: true },
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/", permanent: true },
      // Anything else that isn't the API, the admin, a build asset or a file.
      {
        source: "/:path((?!api/|admin|_next/|_vercel/|opengraph-image|.*\\.).+)",
        destination: "/",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
