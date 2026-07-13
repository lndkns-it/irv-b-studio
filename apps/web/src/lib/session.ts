import { cookies } from "next/headers";
import { prisma } from "@irv-b/database";
import { verifyToken } from "./auth";

/**
 * Reads the current session from the httpOnly cookie and returns the logged-in
 * user, or null if there's no valid session.
 *
 * This runs on the server, so the token is verified securely and the DB is
 * queried without exposing anything to the client.
 */
export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if(!token) return null;

    const payload = verifyToken(token);
    if(!payload) return null;

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, name: true, artistName: true },
    });

    return user;
}
