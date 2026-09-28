import { useLayoutEffect, useRef, useState } from "react";
import { ArrowLeftIcon, SendIcon } from "lucide-react";
import { Badge } from "../../../shared/ui/Badge";
import { Button } from "../../../shared/ui/Button";
import { TextArea } from "../../../shared/ui/TextArea";
import { MessageBox } from "../components/shared/MessageBox";
import conversationService from "../api/conversationService";
import { useQuery } from "@tanstack/react-query";
import type { ConversationDto } from "../models/ConversationDto";
import type { CreateMessageDto } from "../models/CreateMessageDto";
import { useForm } from "react-hook-form";
import type { UserDto } from "../../../shared/models/UserDto";
import { messagesSocket } from "../api/messagesSocket";
import type { MessageDto } from "../models/MessageDto";

interface ConversationPanelProps {
    recipient: UserDto | null;
    onBack: () => void;
}

export function ConversationPanel({ recipient, onBack }: ConversationPanelProps) {

    const listRef = useRef<HTMLUListElement>(null);
    const [isSending, setIsSending] = useState(false);
    
    const { register, handleSubmit, reset, watch } = useForm<CreateMessageDto>();
    const content = watch("content");

    const { data: conversation, isLoading, isError } = useQuery<ConversationDto | null>({
        queryKey: ["conversation", recipient?.id],
        queryFn: () => conversationService.findByRecipientId(recipient?.id ?? ""),
        enabled: Boolean(recipient?.id),
    });

    const messages = conversation?.messages ?? [];

    useLayoutEffect(() => {
        const list = listRef.current;
        if (!list) return;
        list.scrollTop = list.scrollHeight;
    }, [messages.length, recipient?.id]);

    const handleSendMessage = (data: CreateMessageDto) => {
        if (!recipient || isSending) return;
        const trimmed = data.content.trim();
        if (!trimmed) return;

        setIsSending(true);
        messagesSocket.timeout(8000).emit(
            "createMessage",
            { recipientId: recipient.id, content: trimmed },
            (error: unknown, response?: { status?: string }) => {
                setIsSending(false);
                if (error) return;
                if (response && typeof response === "object"
                    && response.status === "error") return;
                reset();
            },
        );
    };

    const renderMessages = () => {
        if (isLoading) {
            return (
                <li className="p-4 animate-pulse rounded-bl-md bg-muted text-foreground">
                    Loading conversation…
                </li>
            );
        }
        if (isError) {
            return <li className="p-4 text-sm text-muted-foreground">Couldn&apos;t load this conversation.</li>;
        }
        if (messages.length === 0) {
            return <li className="p-4 text-sm text-muted-foreground">No messages yet</li>;
        }
        return messages.map((message: MessageDto) => (
            <MessageBox key={message.id} message={message} />
        ));
    };

    return (
        <section
            className="flex min-h-0 flex-1 flex-col"
            aria-label={`Conversation with ${recipient?.username}`}
        >
            <header className="flex items-center gap-3 border-b border-border px-3 py-3">
                <Button
                    type="button"
                    variant="unstyled"
                    aria-label="Back to inbox"
                    onClick={onBack}
                    leftIcon={<ArrowLeftIcon className="size-5" />}
                    className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />

                <Badge size="lg" user={recipient!} />

                <h1 className="min-w-0 truncate text-sm font-semibold text-card-foreground">
                    {recipient?.username}
                </h1>
            </header>

            <ul ref={listRef} className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
                {renderMessages()}
            </ul>

            <form
                onSubmit={handleSubmit(handleSendMessage)}
                className="border-t border-border p-3"
            >
                <div className="relative flex items-end gap-2">
                    <TextArea
                        rows={1}
                        {...register("content", { maxLength: 1000 })}
                        placeholder="Write a message"
                        className="pr-14"
                        helperText={`${content?.length ?? 0}/1000`}
                    />
                    <Button
                        type="submit"
                        variant="unstyled"
                        aria-label="Send message"
                        disabled={!content?.trim() || isSending}
                        rightIcon={<SendIcon className="size-4" />}
                        className="absolute top-1/2 right-0 grid size-12 shrink-0 -translate-y-1/2 cursor-pointer place-items-center rounded-xl text-primary-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </form>
        </section>
    );
}
