import { Outlet } from "react-router-dom"

export default function SettingsPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
        </main>
    )
}