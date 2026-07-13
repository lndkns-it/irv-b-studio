import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { LogoutButton } from "@/components/LogoutButton";

/**
 * Dashboard — protected route.
 *
 * Verifies the session on the server. If there's no valid session, redirects
 * to login before rendering anything. This is real protection: it happens on
 * the server, not the client, so it can't be bypassed.
 */
export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return ( 
        <main className="min-h-screen p-8">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-content mb-2">
                        Welcome, {user.name} 🎵
                    </h1>
                    <p className="text-content-muted">
                        {user.artistName
                            ? `Signed in as ${user.artistName}`
                            : "Your music studio dashboard"}
                    </p>
                </div>
                <LogoutButton />
            </header>
        </main>
    );
}
