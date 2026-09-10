import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * Per-request i18n configuration.
 *
 * Resolves the active locale and loads its message file. Falls back to the
 * default locale if the requested one isn't supported.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "en" | "es")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});