import { MessageSquareIcon } from "lucide-react";
import { useState } from "react";
import { InboxPanel } from "./InboxPanel";
import { Button } from "../../../shared/ui/Button";

export function MessageButton() {

    const [isInboxOpen, setIsInboxOpen] = useState(false);

    return (
        <>
            {!isInboxOpen
                ? <Button variant="unstyled" onClick={() => setIsInboxOpen(true)}>
                    <figure className="fixed bottom-5 right-5 rounded-full 
        p-4 bg-linear-to-r from-primary to-primary/50 shadow-lg
        hover:scale-105 transition-all duration-300">
                        <MessageSquareIcon className="size-5" />
                    </figure>
                </Button>
                :
                <InboxPanel onClose={() => setIsInboxOpen(false)} />}
        </>
    );
}