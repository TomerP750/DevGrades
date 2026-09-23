import { ArrowLeftIcon, SendIcon } from "lucide-react";
import { Badge } from "../../../shared/ui/Badge";
import { Button } from "../../../shared/ui/Button";
import { TextArea } from "../../../shared/ui/TextArea";
// import { messagesSocket } from "../api/messagesSocket";
import { MessageBox } from "../components/shared/MessageBox";
import conversationService from "../api/conversationService";
import { useQuery } from "@tanstack/react-query";
import type { ConversationDto } from "../models/ConversationDto";
import type { CreateMessageDto } from "../models/CreateMessageDto";
import { useForm } from "react-hook-form";
import type { UserDto } from "../../../shared/models/UserDto";

interface ConversationPanelProps {
    recipient: UserDto | null;
    onBack: () => void;
}

export function ConversationPanel({ recipient, onBack }: ConversationPanelProps) {

    const { register, handleSubmit, reset, watch } = useForm<CreateMessageDto>();

    const content = watch("content");

    const { data: conversation } = useQuery<ConversationDto>({
        queryKey: ["conversation", recipient?.id],
        queryFn: () => conversationService.findByRecipientId(recipient?.id ?? ""),
        enabled: false,
    });

    const conversationName = conversation ? conversation.users.find(
        (user) => user.id !== recipient?.id
    )?.username : "";

    const handleSendMessage = (data: CreateMessageDto) => {
        
        reset();
    }

    return (
        <section
            className="flex min-h-0 flex-1 flex-col"
            aria-label={`Conversation with ${conversationName}`}
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

            <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
                {conversation ? conversation.messages.map((message) => (
                    <MessageBox
                        key={message.id}
                        message={message}
                        conversation={conversation}
                    />
                ))
                    : <div className="p-4 text-sm text-muted-foreground">
                        No messages found
                    </div>}
            </ul>

            <form
                onSubmit={handleSubmit(handleSendMessage)}
                className="border-t border-border p-3"
            >
                <div className="relative flex items-end gap-2">
                    <TextArea
                        rows={1}
                        {...register("content")}
                        placeholder="Write a message"
                    />
                    <Button
                        type="submit"
                        variant="unstyled"
                        aria-label="Send message"
                        disabled={!content?.trim()}
                        rightIcon={<SendIcon className="size-4" />}
                        className="absolute top-1/2 right-0 -translate-y-1/2 size-12 shrink-0 cursor-pointer place-items-center rounded-xl text-primary-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

            </form>
        </section>
    );
}