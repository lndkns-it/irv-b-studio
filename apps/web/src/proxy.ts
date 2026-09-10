import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * i18n middleware.
 *
 * Detects the locale from the URL prefix and handles redirects (e.g. "/" ->
 * "/en"). Runs on every request except static assets and API routes.
 */
export default createMiddleware(routing);

export const config = {
  // Match all paths except API routes, Next internals, and static files
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};