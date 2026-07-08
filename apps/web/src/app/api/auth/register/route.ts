import { NextResponse } from "next/server";
import { prisma } from "@irv-b/database";
import { hashPassword, createToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import { z } from "zod";

/**
 * POST /api/auth/register
 *
 * Registers a new user: validates input, hashes the password, creates the
 * user, and returns a signed session token in an httpOnly cookie.
 */
export async function POST(request: Request) {
    // 1. Parse and validate the request body
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if(!result.success) {
        return NextResponse.json(
            { error: "Invalid input", details: z.treeifyError(result.error) },
            { status: 400 },
        );
    }

    const { email, name, password, artistName } = result.data;

    // 2. Check if the email is already taken
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return NextResponse.json(
            { error: "An account with this email already exists" },
            { status: 409 },
        );
    }

    // 3. Hash the password and create the user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
        data: { email, name, passwordHash, artistName },
    });

    // 4. Create a session token
    const token = createToken({ userId: user.id, email: user.email });

    // 5. Return the user (without the hash) and set the token as an httpOnly cookie
    const response = NextResponse.json(
        { user: { id: user.id, email: user.email, name: user.name } },
        { status: 201 },
    );

    response.cookies.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });

    return response;
}