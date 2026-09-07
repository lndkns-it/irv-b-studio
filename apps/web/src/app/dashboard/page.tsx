import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@irv-b/database";
import { getCurrentUser } from "@/lib/session";
import { LogoutButton } from "@/components/LogoutButton";
import { TrackTable } from "@/components/tracks/TrackTable";
import { Button } from "@/components/ui/Button";

/**
 * Dashboard — protected route.
 *
 * Loads the authenticated user's tracks on the server and renders them. Data
 * fetching happens here (the container); TrackTable only presents the data.
 */
export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const tracks = await prisma.track.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    });

    return ( 
        <main className="min-h-screen p-8 max-w-4xl mx-auto">
            <header className="flex items-center justify-between mb-8">
                <div>
                <h1 className="text-3xl font-bold text-content mb-1">
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

            <section>
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-content">Your tracks</h2>
                <Link href="/dashboard/upload">
                    <Button size="sm">Upload track</Button>
                </Link>
                </div>
                <TrackTable tracks={tracks} />
            </section>
        </main>
    );
}
