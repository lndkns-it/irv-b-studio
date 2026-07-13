import { forwardRef, type InputHTMLAttributes } from "react";

/**
 * Input — design system primitive.
 *
 * An accessible text input built on the native <input>. Supports an error
 * state that wires up `aria-invalid` for screen readers.
 */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean;
}

const baseStyles =
  "w-full h-11 px-3 rounded-md border bg-surface text-content " +
  "placeholder:text-content-subtle " +
  "transition-colors " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

export const Input = forwardRef<HTMLInputElement, InputProps>(
    function Input({ hasError = false, className = "", ...props} , ref) {
        const borderStyles = hasError
            ? "border-danger focus-visible:outline-danger"
            : "border-border";

        return (
            <input
                ref={ref}
                aria-invalid={hasError || undefined}
                className={`${baseStyles} ${borderStyles} ${className}`}
                {...props}
            />
        );
    },
);