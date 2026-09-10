import type { ReactNode } from "react";
import "./globals.css";

/**
 * Root layout.
 *
 * Minimal by design: the <html> lang attribute and the i18n provider live in
 * the [locale] layout, which knows the active language. This root only imports
 * global styles.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}