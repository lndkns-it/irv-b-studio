"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

/**
 * LogoutButton - signs the user out and redirects to login.
 */
export function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
            router.refresh(); // clear any cached server data
        } catch {
            setLoading(false);
        }
    }

    return (
        <Button variant="secondary" size="sm" onClick={handleLogout} disabled={loading}>
            {loading ? "Signing out..." : "Sign out"}
        </Button>
    )
}