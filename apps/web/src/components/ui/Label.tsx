import  { type LabelHTMLAttributes } from "react";

/**
 * Label — design system primitive.
 *
 * A form label. The `htmlFor` prop must match the input's `id` so screen
 * readers announce the label when the input is focused.
 */

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

export function Label({ children, required = false, className = "", ...props }: LabelProps) {
    return (
        <label className={`block text-sm font-medium text-content mb-1.5 ${className}`} {...props}>
            {children}
            {required && (
                <span className="text-danger ml-0.5" aria-hidden="true">
                    *
                </span>
            )}
        </label>
    );
}