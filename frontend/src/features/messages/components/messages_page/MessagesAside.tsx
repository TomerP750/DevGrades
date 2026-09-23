import { ConversationListItem } from "../shared/ConversationListItem";
import { Button } from "../../../../shared/ui/Button";
import { MessageSquarePlusIcon } from "lucide-react";
import { SearchInput } from "../../../../shared/ui/SearchInput";
import type { ConversationDto } from "../../models/ConversationDto";
import { useQuery } from "@tanstack/react-query";
import conversationService from "../../api/conversationService";

interface MessagesAsideProps {
    recipientId: string | null;
    onSelect: (conversationId: string) => void;
}

export function MessagesAside({ recipientId, onSelect }: MessagesAsideProps) {

    const { data: conversations } = useQuery<ConversationDto[]>({
        queryKey: ["conversations"],
        queryFn: () => conversationService.findAllByForCurrentUser(),
        enabled: false,
    });

    return (
        <aside
            aria-label="Conversations"
            className="py-3 flex min-h-0 w-full flex-col border-b border-border md:border-b-0 md:border-r"
        >
            <div className="flex gap-3 items-center justify-between p-4">
                <SearchInput />
                <Button
                    variant="unstyled"
                    className="cursor-pointer hover:text-primary"
                    leftIcon={<MessageSquarePlusIcon className="size-5" />}
                    onClick={() => { }}
                />
            </div>

            <ul className="space-y-0.5 overflow-y-auto">
                {conversations
                    ? conversations.map((conversation) => (
                        <ConversationListItem
                            key={conversation.id}
                            conversation={conversation}
                            onSelect={onSelect}
                            isSelected={false}
                            user={conversation.users.find(user => user.id !== recipientId)!}
                        />
                    ))
                    : <div className="p-4 text-sm text-muted-foreground">
                        No conversations found
                    </div>}
            </ul>
        </aside>
    );
}