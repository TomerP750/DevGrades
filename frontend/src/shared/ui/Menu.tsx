import type { ReactNode } from "react";

interface MenuProps {
    isOpen: boolean;
    children: ReactNode;
    className?: string;
}

export function Menu({
    isOpen,
    children,
    className = "",
}: MenuProps) {
    if (!isOpen) return null;

    return (
        <div
            className={`absolute right-0 top-full z-30 mt-2 border border-border bg-card text-card-foreground shadow-xl ${className}`}
        >
            {children}
        </div>
    );
}
