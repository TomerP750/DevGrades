import { Link } from "react-router-dom";
import { useState } from "react";
import { Badge } from "../../../shared/ui/Badge";
import { Logo } from "../../../shared/ui/Logo";
import { useTheme } from "../../../shared/contexts/ThemeContext";
import { Button } from "../../../shared/ui/Button";
import { MoonIcon, SunIcon } from "lucide-react";
import { dummyData } from "../../profile/api/dummyData";
import { UserMenu } from "../components/UserMenu";

const projectsUnderlineClassName =
    "relative after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:origin-center after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:content-[''] group-hover:after:scale-x-100";

export function FeedNavbar() {

    const { theme, setTheme } = useTheme();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const user = dummyData[0].user;

    return (
        <nav
            aria-label="Feed navigation"
            className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md"
        >
            <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
                <div className="shrink-0 text-lg font-bold tracking-tight sm:text-xl">
                    <Logo isLink />
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <Link
                        to="/feed"
                        aria-current="page"
                        className="group px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3"
                    >
                        <span className={projectsUnderlineClassName}>Projects</span>
                    </Link>
                </div>

                <div className="flex items-center gap-1">

                    <div className="relative flex justify-end">
                        <button
                            type="button"
                            aria-label={`Open ${user.firstName} ${user.lastName}'s menu`}
                            aria-expanded={isUserMenuOpen}
                            title={`@${user.username}`}
                            onClick={() => setIsUserMenuOpen((open) => !open)}
                            className="cursor-pointer rounded-full transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            <Badge
                                user={user}
                                size="md"
                                className="size-9 px-0"
                            />
                        </button>
                        <UserMenu
                            isOpen={isUserMenuOpen}
                            user={user}
                            onClose={() => setIsUserMenuOpen(false)}
                        />
                    </div>

                    <Button
                        variant="ghost"
                        className="rounded-full cursor-pointer hover:bg-transparent"
                        size="sm"
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                        {theme === "light"
                            ? <SunIcon className="size-4" />
                            : <MoonIcon className="size-4" />
                        }
                    </Button>
                </div>
            </div>
        </nav>
    );
}