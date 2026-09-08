import { Link } from "react-router-dom";
import { Badge } from "../../../shared/ui/Badge";
import { Logo } from "../../../shared/ui/Logo";
import type { UserDto } from "../../../shared/models/UserDto";

interface FeedNavbarProps {
    user: UserDto;
}

export function FeedNavbar({ user }: FeedNavbarProps) {
    const initials =
        `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

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
                        className="px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3"
                    >
                        Projects
                    </Link>
                </div>

                <div className="flex items-center gap-1 sm:gap-3">
                    
                    <Link
                        to={`/users/${user.id}`}
                        aria-label={`Open ${user.firstName} ${user.lastName}'s profile`}
                        title={`@${user.username}`}
                        className="rounded-full transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        <Badge
                            variant="primary"
                            size="md"
                            className="size-9 px-0"
                        >
                            {initials}
                        </Badge>
                    </Link>
                </div>
            </div>
        </nav>
    );
}