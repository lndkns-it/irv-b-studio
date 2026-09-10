import { defineRouting } from "next-intl/routing";

/**
 * i18n routing configuration.
 *
 * Locales are prefixed in the URL (/en/..., /es/...). English is the default;
 * Spanish is fully supported. Adding a locale later is a one-line change here
 * plus a messages file.
 */
export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
});
