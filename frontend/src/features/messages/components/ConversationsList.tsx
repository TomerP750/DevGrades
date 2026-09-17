import { MessageSquarePlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../../../shared/ui/Button";
import { SearchInput } from "../../../shared/ui/SearchInput";
import {
    ConversationListItem,
    type ConversationPreview,
} from "./ConversationListItem";

export const dummyConversations: ConversationPreview[] = [
    {
        id: 1,
        name: "Example Name",
        lastMessage: "Example Last Message",
    },
    {
        id: 2,
        name: "Example Name 2",
        lastMessage: "Example Last Message 2",
    },
];

interface ConversationsListProps {
    onSelect: (conversationId: number) => void;
}

export function ConversationsList({ onSelect }: ConversationsListProps) {
    const [query, setQuery] = useState("");

    const conversations = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) return dummyConversations;

        return dummyConversations.filter(
            (conversation) =>
                conversation.name.toLowerCase().includes(normalizedQuery) ||
                conversation.lastMessage.toLowerCase().includes(normalizedQuery),
        );
    }, [query]);

    return (
        <div className="flex min-h-0 flex-1 flex-col px-4 py-5 rounded-lg">
            <div className="mb-4 flex items-center gap-4">
                <SearchInput
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search messages"
                    aria-label="Search conversations"
                />
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
                {conversations.map((conversation) => (
                    <ConversationListItem
                        key={conversation.id}
                        conversation={conversation}
                        onSelect={onSelect}
                    />
                ))}
            </ul>
        </div>
    );
}