import { useState } from "react";
import { XIcon } from "lucide-react";
import { ConversationPanel } from "../pages/ConversationPanel";
import { MessagesAside } from "./messages_page/MessagesAside";
import type { UserDto } from "../../../shared/models/UserDto";
import { Button } from "../../../shared/ui/Button";

interface InboxPanelProps {
    onClose: () => void;
}

export function InboxPanel({ onClose }: InboxPanelProps) {
    const [recipient, setRecipient] = useState<UserDto | null>(null);

    return (
        <div className="fixed right-6 bottom-6 z-50 flex h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h1 className="text-sm font-semibold text-card-foreground">Inbox</h1>
                <Button
                    type="button"
                    variant="unstyled"
                    aria-label="Close inbox"
                    onClick={onClose}
                    className="grid size-8 cursor-pointer place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                    <XIcon className="size-5" />
                </Button>
            </div>

            {recipient ? (
                <ConversationPanel
                    recipient={recipient}
                    onBack={() => setRecipient(null)}
                />
            ) : (
                <MessagesAside
                    recipient={null}
                    onSelect={setRecipient}
                />
            )}
        </div>
    );
}
