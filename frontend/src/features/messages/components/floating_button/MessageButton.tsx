import { MessageSquareIcon } from "lucide-react";
import { useState } from "react";
import { InboxPanel } from "../InboxPanel";
import { Button } from "../../../../shared/ui/Button";

export function MessageButton() {

    const [isInboxOpen, setIsInboxOpen] = useState(false);

    return (
        <div className="hidden z-50 md:block fixed bottom-5 right-5">
            {
                !isInboxOpen
                    ? <Button
                        variant="unstyled"
                        onClick={() => setIsInboxOpen(true)}
                        rightIcon={<MessageSquareIcon className="size-5" />}
                        className="p-4 relative cursor-pointer overflow-hidden rounded-full 
                bg-gradient-to-r from-primary to-primary/50 shadow-lg
                hover:scale-105 transition-all duration-300"
                    />
                    :
                    <InboxPanel
                        onClose={() => setIsInboxOpen(false)}
                    />
            }

        </div>
    );
}