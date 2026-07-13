"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

/**
 * Registration page.
 *
 * A controlled form that posts to /api/auth/register, handling loading and
 * error states. Client-side validation exists for UX; the server validates
 * again for security.
 */
export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        name: "",
        password: "",
        artistName: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value}));
    }

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if(!res.ok) {
                const data = await res.json();
                throw new Error(data.error ?? "Something went wrong");
            }

            // Success - redirect to the dashboard (built later)
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-surface-muted">
            <div className="w-full max-w-md bg-surface rounded-xl border border-border p-8 shadow-sm">
                <h1 className="text-2xl font-bold text-content mb-1">Create your account</h1>
                <p className="text-content-muted mb-6">Start managing your music with AI</p>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                    <div>
                        <Label htmlFor="name" required>
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="email" required>
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="artistName">Artist name</Label>
                        <Input
                            id="artistName"
                            name="artistName"
                            value={form.artistName}
                            onChange={handleChange}
                            placeholder="Optional"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password" required>
                            Password
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            required
                        />
                        <p className="text-xs text-content-subtle mt-1">
                            At least 8 characters.
                        </p>
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-danger">
                            {error}
                        </p>
                    )}

                    <Button type="submit" disabled={submitting} className="mt-2">
                        {submitting ? "Creating account..." : "Create account"}
                    </Button>
                </form>

                <p className="text-sm text-content-muted mt-6 text-center">
                    Already have an account?{" "}
                    <a href="/login" className="text-brand-700 font-medium hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </main>
    );
}
