import { useState } from "react";
import { MessagesAside } from "../components/messages_page/MessagesAside";
import { ConversationPanel } from "./ConversationPanel";

export default function MessagesPage() {

    const [selectedId, setSelectedId] = useState<string | null>(null);

    return (
        <section
            aria-label="Messages"
            className="mx-auto flex h-[calc(100dvh-4.5rem)] min-h-0 w-full max-w-7xl flex-col overflow-hidden px-4 py-4 pb-24 sm:px-6 md:pb-4 lg:px-8"        >
            <div className="flex min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card">
                <div
                    className={
                        selectedId
                            ? "hidden min-h-0 md:flex md:w-80 md:shrink-0"
                            : "flex min-h-0 min-w-0 flex-1 md:w-80 md:flex-none md:shrink-0"
                    }
                >
                    <MessagesAside
                        conversationId={selectedId}
                        onSelect={setSelectedId}
                    />
                </div>

                <div
                    className={
                        selectedId
                            ? "flex min-h-0 min-w-0 flex-1"
                            : "hidden min-h-0 min-w-0 flex-1 md:flex"
                    }
                >
                    <ConversationPanel
                        conversationId={selectedId}
                        onBack={() => setSelectedId(null)}
                    />
                </div>
            </div>
        </section>
    );
}