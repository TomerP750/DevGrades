import { useState } from "react";
import { XIcon } from "lucide-react";
import { ConversationsList } from "./shared/ConversationsList";
import { ConversationPanel } from "../pages/ConversationPanel";

type InboxView =
    | { name: "list" }
    | { name: "conversation"; conversationId: string };

interface InboxPanelProps {
    onClose: () => void;
}

export function InboxPanel({ onClose }: InboxPanelProps) {
    
    const [view, setView] = useState<InboxView>({ name: "list" });

    return (
        <div className="fixed right-6 bottom-6 z-50 flex h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-stone-950">
            <div className="flex items-center justify-between bg-primary p-4">
                <h1 className="text-2xl font-bold">Inbox</h1>
                <button type="button" onClick={onClose} aria-label="Close inbox">
                    <XIcon className="size-6" />
                </button>
            </div>

            {view.name === "list" ? (
                <ConversationsList
                    onSelect={(conversationId) =>
                        setView({ name: "conversation", conversationId })
                    }
                />
            ) : (
                <ConversationPanel
                    conversationId={view.conversationId}
                    onBack={() => setView({ name: "list" })}
                />
            )}
        </div>
    );
}