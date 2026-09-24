import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import userService from "../../../../shared/apis/userService";
import type { UserDto } from "../../../../shared/models/UserDto";
import { SearchInput } from "../../../../shared/ui/SearchInput";
import conversationService from "../../api/conversationService";
import type { ConversationDto } from "../../models/ConversationDto";
import { ConversationListItem } from "../shared/ConversationListItem";
import { UserSearchResult } from "./UserSearchResult";

interface MessagesAsideProps {
    recipient: UserDto | null;
    onSelect: (recipient: UserDto) => void;
}

export function MessagesAside({ recipient, onSelect }: MessagesAsideProps) {

    const [query, setQuery] = useState<string>("");

    const { data: conversations } = useQuery<ConversationDto[]>({
        queryKey: ["conversations"],
        queryFn: () => conversationService.findAllByForCurrentUser(),
    });

    const { data: users } = useQuery<UserDto[]>({
        queryKey: ["messages-users", query],
        queryFn: () => userService.searchUsers(query),
        enabled: query.trim().length > 0,
    });

    return (
        <aside
            aria-label="Conversations"
            className="py-3 flex min-h-0 w-full flex-col border-b border-border md:border-b-0 md:border-r"
        >
            <div className="p-4 flex items-center justify-between">
                <SearchInput onAfterSearch={setQuery} />
            </div>

            <div className="relative">
                {query.trim().length > 0 ? (
                    users && users.length > 0 ? (
                        <div className="absolute right-4 top-full z-50 mt-2 w-72 rounded-lg border bg-background p-1 shadow-lg">
                            {users.map((user) => (
                                <UserSearchResult
                                    key={user.id}
                                    user={user}
                                    onSelect={(user) => {
                                        setQuery("");
                                        onSelect(user)
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="absolute right-4 top-full z-50 mt-2 w-72 rounded-lg border bg-background p-4 text-sm text-muted-foreground shadow-lg">
                            No users found
                        </div>
                    )
                ) : (
                    <ul className="space-y-0.5 overflow-y-auto">
                        {conversations?.length ? (
                            conversations.map((conversation) => (
                                <ConversationListItem
                                    key={conversation.id}
                                    conversation={conversation}
                                    onSelect={(user) => onSelect(user)}
                                    isSelected={false}
                                    recipient={conversation.users.find(
                                        (user) => user.id !== recipient?.id
                                    )!}
                                />
                            ))
                        ) : (
                            <div className="p-4 text-sm text-muted-foreground">
                                No conversations found
                            </div>
                        )}
                    </ul>
                )}
            </div>

        </aside>
    );
}