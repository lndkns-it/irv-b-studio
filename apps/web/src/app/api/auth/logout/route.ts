import { NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * 
 * Clears the session cookie, ending the user's session.
 */
export async function POST() {
    const response =  NextResponse.json({ success: true });

    // Overwrite the session cookie with an expired one to remove it
    response.cookies.set("session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0, // expires immediately
        path: "/",
    });

    return response;
}