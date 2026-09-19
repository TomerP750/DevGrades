import { ArrowLeftIcon, SendIcon } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { Button } from "../../../shared/ui/Button";
import { dummyConversations } from "../api/dummyConversation";
import { TextArea } from "../../../shared/ui/TextArea";
import { dummyMessages } from "../api/dummyMessages";
import { Badge } from "../../../shared/ui/Badge";
import { MessageBox } from "../components/MessageBox";

interface ConversationPanelProps {
    conversationId: string | null;
    onBack: () => void;
}

export function ConversationPanel({ conversationId, onBack }: ConversationPanelProps) {

    const [draft, setDraft] = useState("");

    const conversation = dummyConversations.find(
        (item) => item.id === conversationId,
    );

    if (!conversation) {
        return (
            <p className="p-4 text-sm text-muted-foreground">
                Conversation not found.
            </p>
        );
    }

    const conversationName = conversation.name;

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
        }
    };

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
                    className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <ArrowLeftIcon className="size-5" />
                </Button>

                <Badge size="lg" user={conversation.users[0]} />

                <h1 className="min-w-0 truncate text-sm font-semibold text-card-foreground">
                    {conversationName}
                </h1>
            </header>

            <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
                {dummyMessages.map((message) => (
                    <MessageBox
                        key={message.id}
                        message={message}
                        conversation={conversation}
                    />
                ))}
            </ul>

            <form
                onSubmit={() => { }}
                className="border-t border-border p-3"
            >
                <div className="relative flex items-end gap-2">
                    <TextArea
                        rows={1}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Write a message"
                    />
                    <Button
                        type="submit"
                        variant="unstyled"
                        aria-label="Send message"
                        disabled={!draft.trim()}
                        className="absolute top-1/2 right-0 -translate-y-1/2 size-12 shrink-0 cursor-pointer place-items-center rounded-xl text-primary-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <SendIcon className="size-4" />
                    </Button>
                </div>
            </form>
        </section>
    );
}