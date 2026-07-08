import { NextResponse } from "next/server";
import { prisma } from "@irv-b/database";
import { verifyPassword, createToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

/**
 * POST /api/auth/login
 *
 * Authenticates an existing user: validates input, verifies the password
 * against the stored hash, and returns a signed session token in an httpOnly
 * cookie.
 */
export async function POST(request: Request) {
    // 1. Parse and validate the request body
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { email, password } = result.data;

    // 2. Find the user
    const user = await prisma.user.findUnique({ where: { email } });

    // 3. Verify credentials
    //    Note: we return the SAME error whether the email doesn't exist or the
    //    password is wrong. This prevents attackers from discovering which
    //    emails are registered (user enumeration).
    const passwordValid = user
        ? await verifyPassword(password, user.passwordHash)
        : false;

    if (!user || !passwordValid) {
        return NextResponse.json(
            { error: "Invalid email or password" },
            { status: 401 },
        );
    }

    // 4. Create a session token
    const token = createToken({ userId: user.id, email: user.enail });

    // 5. Return the user and set the session cookie
    const response = NextResponse.json({
        user: { id: user.id, email: user.email, name: user.name },
    });

    response.cookies.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });

    return response;
}