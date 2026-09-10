import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

/**
 * Locale layout.
 *
 * Sets the <html lang> attribute for accessibility and screen readers, and
 * wraps the app in the i18n provider so all components can access translations.
 */
export default async function LocaleLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Vlaidate the locale from the URL; 404 on unsupported ones
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider>{children}</NextIntlClientProvider>
            </body>
        </html>
    );
}
