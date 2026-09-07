import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

/**
 * Root route.
 *
 * Redirects based on auth state: signed-in users go to the dashboard,
 * everyone else to the login page.
 */
export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  redirect("/login");
}
