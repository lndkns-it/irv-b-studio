import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Authentication utilities: password hashing and JWT handling.
 *
 * Security notes:
 * - Passwords are never stored in plain text — only bcrypt hashes.
 * - The JWT secret lives in an environment variable, never in code.
 */

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = "7d";

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
}

/** Hash a plain-text password before storing it */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/** Verify a plain-text password against a stored hash. */
export async function verifyPassword(
    password: string,
    hash: string,
): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export interface TokenPayload {
    userId: string;
    email: string;
}

/** Create a signed JWT for an authenticated user. */
export function createToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET as string, { expiresIn: TOKEN_EXPIRY });
}

/** Verify and decode a JWT. Returns the payload or null if invalid. */
export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET as string) as TokenPayload;
    } catch {
        return null;
    }
}
