import { LogOut, Settings, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { UserDto } from "../../../shared/models/UserDto";
import { Badge } from "../../../shared/ui/Badge";
import { Menu } from "../../../shared/ui/Menu";
import { useAuth } from "../../authentication/contexts/AuthContext";

interface UserMenuProps {
    isOpen: boolean;
    user: UserDto;
    onClose: () => void;
}

const menuItemClassName =
    "group flex w-full items-center gap-3 px-2 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function UserMenu({ isOpen, user, onClose }: UserMenuProps) {
    
    const { logout } = useAuth();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleLogout = async () => {
        onClose();
        await logout();
        navigate("/sign-in");
    };

    return (
        <Menu
            isOpen={isOpen}
            className="right-0 w-64 p-4"
        >
            <div className="flex items-center gap-3">
                <Badge user={user} size="lg" />
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-card-foreground">
                        {user.firstName} {user.lastName}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        @{user.username}
                    </p>
                </div>
            </div>

            <div className="my-4 border-t border-border" />

            <div className="grid gap-1">
                <Link
                    to={`/u/${user.id}`}
                    onClick={onClose}
                    className={menuItemClassName}
                >
                    <UserRound aria-hidden="true" className="size-4 text-muted-foreground transition-colors group-hover:text-accent-foreground" />
                    View profile
                </Link>
                <Link
                    to={`/settings/account`}
                    onClick={onClose}
                    className={menuItemClassName}
                >
                    <Settings aria-hidden="true" className="size-4 text-muted-foreground transition-colors group-hover:text-accent-foreground" />
                    Account settings
                </Link>
            </div>

            <div className="my-4 border-t border-border" />

            <button
                type="button"
                onClick={handleLogout}
                className={`${menuItemClassName} cursor-pointer text-danger hover:bg-muted hover:text-danger`}
            >
                <LogOut aria-hidden="true" className="size-4" />
                Sign out
            </button>
        </Menu>
    );
}