import { ArrowLeftIcon, SendIcon } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { Button } from "../../../shared/ui/Button";
import { dummyConversations } from "../components/ConversationsList";

const dummyMessages = [
    {
        id: 1,
        fromMe: false,
        text: "Hey — could you take a look at the feed layout?",
        sentAt: "10:12",
    },
    {
        id: 2,
        fromMe: true,
        text: "Sure, I'll review it this afternoon.",
        sentAt: "10:14",
    },
    {
        id: 3,
        fromMe: false,
        text: "Example Last Message",
        sentAt: "10:21",
    },
];

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

interface ConversationPageProps {
    conversationId: number;
    onBack: () => void;
}

export function ConversationPage({ conversationId, onBack }: ConversationPageProps) {

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
    const initials = getInitials(conversationName);


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

                <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                >
                    {initials}
                </span>

                <h1 className="min-w-0 truncate text-sm font-semibold text-card-foreground">
                    {conversationName}
                </h1>
            </header>

            <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
                {dummyMessages.map((message) => (
                    <li
                        key={message.id}
                        className={`flex ${message.fromMe ? "justify-end" : "justify-start"}`}
                    >
                        <p
                            className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-5 ${
                                message.fromMe
                                    ? "rounded-br-md bg-primary text-primary-foreground"
                                    : "rounded-bl-md bg-muted text-foreground"
                            }`}
                        >
                            {message.text}
                            <span
                                className={`mt-1 block text-[10px] font-medium ${
                                    message.fromMe
                                        ? "text-primary-foreground/70"
                                        : "text-muted-foreground"
                                }`}
                            >
                                {message.sentAt}
                            </span>
                        </p>
                    </li>
                ))}
            </ul>

            <form
                onSubmit={() => {}}
                className="border-t border-border p-3"
            >
                <div className="flex items-end gap-2">
                    <label htmlFor="message-draft" className="sr-only">
                        Message
                    </label>
                    <textarea
                        id="message-draft"
                        rows={1}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Write a message"
                        className="max-h-32 min-h-10 flex-1 resize-none rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-card-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-3 focus:ring-primary/15"
                    />
                    <Button
                        type="submit"
                        variant="unstyled"
                        aria-label="Send message"
                        disabled={!draft.trim()}
                        className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl bg-primary text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <SendIcon className="size-4" />
                    </Button>
                </div>
            </form>
        </section>
    );
}