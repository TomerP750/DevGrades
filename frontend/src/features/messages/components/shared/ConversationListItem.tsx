import type { UserDto } from "../../../../shared/models/UserDto";
import { Badge } from "../../../../shared/ui/Badge";
import { Button } from "../../../../shared/ui/Button";
import type { ConversationDto } from "../../models/ConversationDto";


interface ConversationListItemProps {
    conversation: ConversationDto;
    onSelect: (recipient: UserDto) => void;
    isSelected: boolean;
    recipient: UserDto;
}

export function ConversationListItem({ conversation, onSelect, isSelected, recipient }: ConversationListItemProps) {
    
    return (
        <li>
            <Button
                type="button"
                variant="unstyled"
                onClick={() => onSelect(recipient)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isSelected ? "bg-muted" : "bg-transparent"}`}
            >
                <Badge size="lg" user={recipient} />
                <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-card-foreground">
                        {recipient.username}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {conversation.lastMessage?.content}
                    </span>
                </span>
            </Button>
        </li>
    );
}