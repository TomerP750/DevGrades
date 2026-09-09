import type { HTMLAttributes } from "react";
import type { UserDto } from "../models/UserDto";
import { getInitials } from "../utils/getInitials";

type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    user: UserDto;
    size?: BadgeSize;
}

const sizeStyles: Record<BadgeSize, string> = {
    sm: "size-6 text-xs",
    md: "size-8 text-sm",
    lg: "size-10 text-base",
};

export function Badge({
    size = "sm",
    className = "",
    user,
    ...props
}: BadgeProps) {
    if (!user) {
        return (
            <span
                className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-semibold text-primary-foreground ${sizeStyles[size]} ${className}`}
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
            className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-semibold text-primary-foreground ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {avatarUrl
                ?
                <img src={avatarUrl}
                    alt="avatar"
                    className="size-full rounded-full object-cover"
                />
                :
                <span className="text-sm font-semibold">
                    {userInitials}
                </span>
            }
        </span>
    );
}
