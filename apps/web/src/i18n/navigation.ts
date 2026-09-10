import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation helpers.
 *
 * These wrap Next's navigation APIs so links and redirects automatically keep
 * the active locale prefix (/en/..., /es/...). Use these instead of importing
 * directly from next/navigation or next/link for internal navigation.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);