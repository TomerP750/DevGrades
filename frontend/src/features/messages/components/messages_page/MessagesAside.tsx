import { ConversationListItem } from "../ConversationListItem";
import { dummyConversations } from "../../api/dummyConversation";
import { Button } from "../../../../shared/ui/Button";
import { MessageSquarePlusIcon, PlusIcon } from "lucide-react";
import { SearchInput } from "../../../../shared/ui/SearchInput";

interface MessagesAsideProps {
    conversationId: string | null;
    onSelect: (conversationId: string) => void;
}

export function MessagesAside({ conversationId, onSelect }: MessagesAsideProps) {
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
                {dummyConversations.map((conversation) => (
                    <ConversationListItem
                        key={conversation.id}
                        conversation={conversation}
                        onSelect={onSelect}
                        isSelected={conversationId === conversation.id}
                    />
                ))}
            </ul>
        </aside>
    );
}