import { forwardRef, type ButtonHTMLAttributes } from "react";

/**
 * Button -design system primitive.
 * 
 * A single, accessible button used across the app. Variants and sizes
 * are driven by design tokens, so theming never requires touching this file.
 */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize =  "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-brand-600 text-white hover_bg-brand-700 active:-brand-900",
    secondary:
        "bg-surface-sunken text-content hover:bg-border active:bg-border-strong",
    ghost:
        "bg-transparent text-brand-700 hover:bg-brand-50 active:bg-brand-100",
    danger:
        "bg-danger text-white hover:opacity-90 active:opacity-80",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-9 px-3 text-sm gap-1.5",
    md: "h-11 px-4 text-base gap-2",
    lg: "h-12 px-6 text-lg gap-2.5",
};

const baseStyles = 
    "inline-flex items-center justify-center rounded-md font-medium " +
    "transition-colors cursor-pointer " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

export const Button = forwardRef<HTMLButtonElement, ButtonProps> (
    function Button(
        { variant = "primary", size = "md", className = "", type = "button", ...props},
        ref,
    ) {
        const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

        return <button ref={ref} type={type} className={classes} {...props}/>
    },
);