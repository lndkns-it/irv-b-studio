import { type HTMLAttributes } from "react";

/**
 * Badge — design system primitive.
 *
 * A small status indicator. Variants map to semantic state colors. Color is
 * never the only signal: the label text always conveys the meaning too, so the
 * badge remains understandable without color perception.
 */

type BadgeVariant = "neutral" | "info" | "success" | "danger";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

const variantStyle: Record<BadgeVariant, string> = {
    neutral: "bg-surface-sunken text-content-muted",
    info: "bg-brand-50 text-brand-700",
    success: "bg-green-50 text-success",
    danger: "bg-red-50 text-danger",
};

export function Badge({ variant = "neutral", className = "", ...props}: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyle[variant]} ${className}`}
            {...props}
        />
    );
}
