import { useState } from "react";
import { MessagesAside } from "../components/messages_page/MessagesAside";
import { ConversationPanel } from "./ConversationPanel";
import type { UserDto } from "../../../shared/models/UserDto";

export default function MessagesPage() {

    const [recipient, setRecipient] = useState<UserDto | null>(null);
    
    return (
        <section
            aria-label="Messages"
            className="mx-auto flex h-[calc(100dvh-4.5rem)] min-h-0 w-full max-w-7xl flex-col overflow-hidden px-4 py-4 pb-24 sm:px-6 md:pb-4 lg:px-8"        >
            <div className="flex min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card">
                <div
                    className={
                        recipient
                            ? "hidden min-h-0 md:flex md:w-80 md:shrink-0"
                            : "flex min-h-0 min-w-0 flex-1 md:w-80 md:flex-none md:shrink-0"
                    }
                >
                    <MessagesAside
                        recipient={recipient}
                        onSelect={(recipient) => setRecipient(recipient)}
                    />
                </div>

                <div
                    className={
                        recipient
                            ? "flex min-h-0 min-w-0 flex-1"
                            : "hidden min-h-0 min-w-0 flex-1 md:flex"
                    }
                >
                    {recipient && <ConversationPanel
                        recipient={recipient}
                        onBack={() => setRecipient(null)}
                    />}
                </div>
            </div>
        </section>
    );
}