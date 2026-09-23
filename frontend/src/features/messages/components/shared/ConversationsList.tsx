import { useQuery } from "@tanstack/react-query";
import { MessageSquarePlusIcon } from "lucide-react";
import { Button } from "../../../../shared/ui/Button";
import conversationService from "../../api/conversationService";
import type { ConversationDto } from "../../models/ConversationDto";
import { ConversationListItem, } from "./ConversationListItem";


interface ConversationsListProps {
    onSelect: (conversationId: string) => void;
    conversationId?: string | null;
}

export function ConversationsList({ onSelect, conversationId }: ConversationsListProps) {

    const { data: conversations } = useQuery<ConversationDto[]>({
        queryKey: ["conversations"],
        queryFn: () => conversationService.findAllByForCurrentUser(),
        enabled: false,
    });

    return (
        <div className="flex min-h-0 flex-1 flex-col px-4 py-5 rounded-lg">
            <div className="mb-4 flex items-center gap-4">
                <Button
                    type="button"
                    variant="unstyled"
                    aria-label="New message"
                    className="cursor-pointer"
                >
                    <MessageSquarePlusIcon className="size-5" />
                </Button>
            </div>

            <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto" aria-label="Conversations">
                {conversations
                    ? conversations.map((conversation) => (
                        <ConversationListItem
                            key={conversation.id}
                            conversation={conversation}
                            onSelect={onSelect}
                            isSelected={conversationId === conversation.id}
                            user={conversation.users[0]}
                        />
                    ))
                    : <div className="p-4 text-sm text-muted-foreground">
                        No conversations found
                    </div>}
            </ul>
        </div>
    );
}