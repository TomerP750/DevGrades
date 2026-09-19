import { NavLink } from "react-router-dom";
import { getActiveNavItemClasses } from "../shared/utils/isActiveNavItem";
import { deviceNavItems } from "./navItems";

interface DeviceNavbarProps {
    userId: string;
}

export function DeviceNavbar({ userId }: DeviceNavbarProps) {
    
    const navItems = deviceNavItems(userId);

    return (
        <nav
            aria-label="Device navigation"
            className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/90 backdrop-blur-md md:hidden"
        >
            <div className="mx-auto grid min-h-18 w-full max-w-7xl grid-cols-4 items-stretch px-4 sm:px-6">
                {navItems.map(item => (
                    <NavLink
                        key={item.label}
                        to={item.to}
                        className={(state) => `${getActiveNavItemClasses(state)} h-full flex-col gap-1`}
                    >
                        <item.Icon aria-hidden="true" className="size-5" />
                        <span className="text-xs">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}