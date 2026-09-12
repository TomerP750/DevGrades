import { NavLink, Outlet } from "react-router-dom"


const linkClasses = "focus:outline-none! focus:ring-0! relative inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:hover:text-white";


const getLinkClasses = ({ isActive }: { isActive: boolean }) => [
    linkClasses,
    isActive
        ? "after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary after:content-[''] dark:text-white"
        : "text-zinc-500 dark:text-zinc-400",
]
    .filter(Boolean)
    .join(" ");


export default function SettingsPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <nav className="flex gap-3 pb-2">
                <NavLink to="account" replace className={getLinkClasses}>Account</NavLink>
                <NavLink to="security" replace className={getLinkClasses}>Security</NavLink>
                <NavLink to="display" replace className={getLinkClasses}>Display</NavLink>
            </nav>
            <Outlet />
        </main>
    )
}