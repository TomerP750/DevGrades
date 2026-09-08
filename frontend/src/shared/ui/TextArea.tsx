
import { forwardRef, useId, type TextareaHTMLAttributes } from "react";


type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    rows?: number;
    label?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
    { label, error, helperText, required, id, rows, className = "", ...props },
    ref,
) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const describedBy =
        [error ? `${inputId}-error` : null, helperText && !error ? `${inputId}-helper` : null]
            .filter(Boolean)
            .join(" ") || undefined;

    const textAreaElement = (
        <textarea
            ref={ref}
            id={inputId}
            rows={rows ?? 3}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            {...props}
            className={`w-full resize-none rounded-lg border bg-card px-3.5 py-3 text-sm text-card-foreground outline-none transition placeholder:text-muted-foreground/70 focus:ring-3 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70 ${
                error ? "border-danger focus:border-danger" : "border-input focus:border-primary"
            } ${className}`}
        />
    )

    if (!label && !error && !helperText) {
        return textAreaElement;
    }

    return (
        <div className="w-full">
            {label && <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-foreground">
                {label} 
                {required ? <span className="ml-1 text-danger">*</span> : null}
            </label>}
            {textAreaElement}
            {error && <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs font-medium leading-5 text-danger">{error}</p>}
            {helperText && !error && <p id={`${inputId}-helper`} className="mt-1.5 text-xs leading-5 text-muted-foreground">{helperText}</p>}
        </div>
    )
})