import { NavLink, Outlet } from "react-router-dom"
import { getActiveNavItemClasses } from "../../../shared/utils/isActiveNavItem"

export default function SettingsPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <nav className="flex gap-3 border-b border-border">
                <NavLink to="account" replace className={getActiveNavItemClasses}>Account</NavLink>
                <NavLink to="security" replace className={getActiveNavItemClasses}>Security</NavLink>
                <NavLink to="display" replace className={getActiveNavItemClasses}>Display</NavLink>
            </nav>
            <Outlet />
        </main>
    )
}