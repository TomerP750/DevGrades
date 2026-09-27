import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../authentication/contexts/AuthContext";
import { messagesSocket } from "../api/messagesSocket";
import type { ConversationDto } from "../models/ConversationDto";
import type { MessageCreatedDto } from "../models/MessageCreatedDto";

export function useIncomingMessages() {
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) return;

        const onMessageCreated = (incoming: MessageCreatedDto) => {
            const otherUserId = incoming.user.id === currentUser.id
                ? incoming.recipientId
                : incoming.user.id;

            queryClient.setQueryData<ConversationDto | null>(
                ["conversation", otherUserId],
                (current) => {
                    const messages = current?.messages ?? [];
                    if (messages.some((message) => message.id === incoming.id)) {
                        return current;
                    }
                    return {
                        id: incoming.conversationId,
                        users: current?.users ?? [],
                        lastMessage: incoming,
                        messages: [...messages, incoming],
                    };
                },
            );

            const conversations = queryClient.getQueryData<ConversationDto[]>(["conversations"]);
            const existing = conversations?.find(
                (conversation) => conversation.id === incoming.conversationId,
            );

            if (!conversations) return;

            if (!existing) {
                queryClient.invalidateQueries({ queryKey: ["conversations"] });
                return;
            }

            queryClient.setQueryData<ConversationDto[]>(["conversations"], (current) => {
                if (!current) return current;
                const updated = { ...existing, lastMessage: incoming };
                return [
                    updated,
                    ...current.filter((conversation) => conversation.id !== incoming.conversationId),
                ];
            });
        };

        messagesSocket.on("messageCreated", onMessageCreated);
        return () => {
            messagesSocket.off("messageCreated", onMessageCreated);
        };
    }, [currentUser, queryClient]);
}
