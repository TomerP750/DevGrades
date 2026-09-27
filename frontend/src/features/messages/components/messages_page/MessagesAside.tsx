import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import userService from "../../../../shared/apis/userService";
import type { UserDto } from "../../../../shared/models/UserDto";
import { SearchInput } from "../../../../shared/ui/SearchInput";
import conversationService from "../../api/conversationService";
import type { ConversationDto } from "../../models/ConversationDto";
import { ConversationListItem } from "../shared/ConversationListItem";
import { UserSearchResult } from "./UserSearchResult";
import { useAuth } from "../../../authentication/contexts/AuthContext";

interface MessagesAsideProps {
    recipient: UserDto | null;
    onSelect: (recipient: UserDto) => void;
}

export function MessagesAside({ recipient, onSelect }: MessagesAsideProps) {

    const [query, setQuery] = useState<string>("");
    const [searchKey, setSearchKey] = useState(0);

    const { user: currentUser } = useAuth();

    const {
        data: conversations,
        isLoading: isLoadingConversations,
        isError: isConversationsError,
    } = useQuery<ConversationDto[]>({
        queryKey: ["conversations"],
        queryFn: () => conversationService.findAllByForCurrentUser(),
    });

    const {
        data: users,
        isLoading: isSearching,
        isError: isSearchError,
    } = useQuery<UserDto[]>({
        queryKey: ["messages-users", query],
        queryFn: () => userService.searchUsers(query),
        enabled: query.trim().length > 0,
    });

    const matches = (users ?? []).filter((user) => user.id !== currentUser?.id);
    const isSearchingUsers = query.trim().length > 0;

    return (
        <aside
            aria-label="Conversations"
            className="flex min-h-0 w-full flex-1 flex-col border-b border-border py-3 md:border-b-0 md:border-r"
        >
            <div className="flex items-center justify-between p-4">
                <SearchInput
                    key={searchKey}
                    onAfterSearch={setQuery}
                />
            </div>

            <div className="relative min-h-0 flex-1">
                {isSearchingUsers ? (
                    <div className="absolute inset-x-4 top-0 z-50 rounded-lg border bg-background p-1 shadow-lg">
                        {isSearching ? (
                            <p className="p-4 text-sm text-muted-foreground">Searching…</p>
                        ) : isSearchError ? (
                            <p className="p-4 text-sm text-muted-foreground">Couldn&apos;t search users.</p>
                        ) : matches.length > 0 ? (
                            matches.map((user) => (
                                <UserSearchResult
                                    key={user.id}
                                    user={user}
                                    onSelect={(user) => {
                                        setQuery("");
                                        setSearchKey((key) => key + 1);
                                        onSelect(user);
                                    }}
                                />
                            ))
                        ) : (
                            <p className="p-4 text-sm text-muted-foreground">No users found</p>
                        )}
                    </div>
                ) : (
                    <ul className="h-full space-y-0.5 overflow-y-auto">
                        {isLoadingConversations ? (
                            <li className="p-4 text-sm text-muted-foreground">Loading conversations…</li>
                        ) : isConversationsError ? (
                            <li className="p-4 text-sm text-muted-foreground">Couldn&apos;t load conversations.</li>
                        ) : conversations?.length ? (
                            conversations.map((conversation) => {
                                const otherUser = conversation.users.find(
                                    (user) => user.id !== currentUser?.id,
                                );
                                if (!otherUser) return null;
                                return (
                                    <ConversationListItem
                                        key={conversation.id}
                                        conversation={conversation}
                                        onSelect={onSelect}
                                        isSelected={recipient?.id === otherUser.id}
                                        recipient={otherUser}
                                    />
                                );
                            })
                        ) : (
                            <li className="p-4 text-sm text-muted-foreground">No conversations found</li>
                        )}
                    </ul>
                )}
            </div>
        </aside>
    );
}
