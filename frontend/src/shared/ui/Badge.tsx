import type { HTMLAttributes } from "react";
import type { UserDto } from "../models/UserDto";
import { getInitials } from "../utils/getInitials";

type BadgeVariant = "primary" | "secondary" | "outline" | "success";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    user: UserDto;
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
    sm: "min-h-6 text-xs",
    md: "min-h-8 text-sm",
    lg: "min-h-10 text-base",
};

export function Badge({
    variant = "secondary",
    size = "sm",
    className = "",
    user,
    ...props
}: BadgeProps) {

    if (!user) {
        return (
            <span
                className={`inline-flex items-center justify-center rounded-full font-semibold ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
                {...props}
            >
                <span className="text-sm font-semibold">G</span>
            </span>
        );
    }

    const { avatarUrl, firstName, lastName } = user;
    const userInitials = getInitials(firstName, lastName);

    return (

        <span
            className={`inline-flex items-center justify-center rounded-full font-semibold ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {avatarUrl
                ?
                <img src={avatarUrl}
                    alt="avatar"
                    className="size-4 rounded-full"
                />
                :
                <span className="text-sm font-semibold">
                    {userInitials}
                </span>
            }
        </span>
    );
}
