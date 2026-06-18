import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Next.js internals (_next, _vercel)
  // - static files (with a dot, e.g. favicon.ico, images, brand assets)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
