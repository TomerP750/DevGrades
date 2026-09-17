import { Button } from "../../../shared/ui/Button";

export interface ConversationPreview {
    id: number;
    name: string;
    lastMessage: string;
}

interface ConversationListItemProps {
    conversation: ConversationPreview;
    onSelect: (conversationId: number) => void;
}

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}



export function ConversationListItem({ conversation, onSelect }: ConversationListItemProps) {
    
    return (
        <li>
            <Button
                type="button"
                variant="unstyled"
                onClick={() => onSelect(conversation.id)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
                >
                    {getInitials(conversation.name)}
                </span>
                <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-card-foreground">
                        {conversation.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {conversation.lastMessage}
                    </span>
                </span>
            </Button>
        </li>
    );
}