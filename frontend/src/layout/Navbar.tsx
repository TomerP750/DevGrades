import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../features/authentication/contexts/AuthContext";
import { UserMenu } from "./UserMenu";
import { DeviceNavbar } from "./DeviceNavbar";
import { Badge } from "../shared/ui/Badge";
import { Button } from "../shared/ui/Button";
import { Logo } from "../shared/ui/Logo";
import { getActiveNavItemClasses } from "../shared/utils/isActiveNavItem";
import { navItems } from "./navItems";

export function Navbar() {
    const { user } = useAuth();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    if (!user) {
        return null;
    }

    return (
        <>
            <nav
                aria-label="Feed navigation"
                className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md"
            >
                <div className="mx-auto flex min-h-18 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
                    <div className="shrink-0 text-lg font-bold tracking-tight sm:text-xl">
                        <Logo isLink />
                    </div>

                    <div className="hidden self-stretch items-center gap-2 sm:gap-4 md:flex">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                className={(state) => `${getActiveNavItemClasses(state)} h-full gap-1.5`}
                            >
                                <item.Icon aria-hidden="true" className="size-5" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </div>

                    <div className="relative hidden justify-end md:flex">
                        <Button
                            type="button"
                            variant="unstyled"
                            aria-label={`Open ${user.firstName} ${user.lastName}'s menu`}
                            aria-expanded={isUserMenuOpen}
                            title={`@${user.username}`}
                            onClick={() => setIsUserMenuOpen((open) => !open)}
                            className="cursor-pointer rounded-full transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            rightIcon={
                                <Badge
                                    user={user}
                                    size="lg"
                                    className="size-9 px-0"
                                />
                            }
                        />
                        <UserMenu
                            isOpen={isUserMenuOpen}
                            user={user}
                            onClose={() => setIsUserMenuOpen(false)}
                        />
                    </div>
                </div>
            </nav>

            <DeviceNavbar userId={user.id} />
        </>
    );
}
