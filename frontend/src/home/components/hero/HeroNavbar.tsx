import { Logo } from "../../../shared/ui/Logo";


export function HeroNavbar() {
    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-transparent backdrop-blur-md">
            <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4">
                <Logo isLink />
            </div>
        </nav>
    )
}