import type { UserDto } from "../../../../shared/models/UserDto";
import { Badge } from "../../../../shared/ui/Badge";

type UserSearchResultProps = {
    user: UserDto;
    onSelect: (user: UserDto) => void;
};

export function UserSearchResult({ user, onSelect, }: UserSearchResultProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(user)}
            className="
                flex w-full items-center gap-3
                rounded-lg px-3 py-2.5
                text-left
                transition-colors
                hover:bg-muted/60
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary/50
            "
        >
            <Badge size="lg" user={user} />

            <p className="min-w-0 truncate text-sm font-medium">
                {user.username}
            </p>
        </button>
    );
}