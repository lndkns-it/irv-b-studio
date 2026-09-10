import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/session";

/**
 * Root route.
 *
 * Redirects based on auth state, preserving the active locale.
 */
export default async function Home({ 
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (user) {
    redirect({ href: "/dashboard", locale });
  }

  redirect({ href: "/login", locale });
}
