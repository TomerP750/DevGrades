import type { HTMLAttributes, ReactNode } from "react";

type BadgeVariant = "primary" | "secondary" | "outline" | "success";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    children: ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, string> = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-border bg-transparent text-foreground",
    success: "bg-accent text-accent-foreground",
};

const sizeStyles: Record<BadgeSize, string> = {
    sm: "min-h-6 px-2 text-xs",
    md: "min-h-8 px-3 text-sm",
    lg: "min-h-10 px-4 text-base",
};

export function Badge({
    children,
    variant = "secondary",
    size = "sm",
    className = "",
    ...props
}: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center justify-center rounded-full font-semibold ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
}
