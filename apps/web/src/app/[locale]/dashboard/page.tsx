import { redirect } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { prisma } from "@irv-b/database";
import { getCurrentUser } from "@/lib/session";
import { LogoutButton } from "@/components/LogoutButton";
import { LiveTrackTable } from "@/components/tracks/LiveTrackTable";
import { Button } from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";

/**
 * Dashboard — protected route.
 *
 * Loads the authenticated user's tracks on the server and renders them. Data
 * fetching happens here (the container); TrackTable only presents the data.
 */
export default async function DashboardPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params;
    const user = await getCurrentUser();

    if (!user) {
        redirect({ href: "/login", locale});
        return;
    }

    const t = await getTranslations();

    const tracks = await prisma.track.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    });

    return ( 
        <main className="min-h-screen p-8 max-w-4xl mx-auto">
            <header className="flex items-center justify-between mb-8">
                <div>
                <h1 className="text-3xl font-bold text-content mb-1">
                    {t("dashboard.welcome", { name: user.name })} 🎵
                </h1>
                <p className="text-content-muted">
                   {user.artistName
                        ? `Signed in as ${user.artistName}`
                        : t("dashboard.yourTracks")}
                </p>
                </div>
                <LogoutButton />
            </header>

            <section>
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-content">
                    {t("dashboard.yourTracks")}
                </h2>
                <Link href="/dashboard/upload">
                    <Button size="sm">{t("dashboard.uploadTrack")}</Button>
                </Link>
                </div>
                <LiveTrackTable initialTracks={tracks} />
            </section>
        </main>
    );
}
