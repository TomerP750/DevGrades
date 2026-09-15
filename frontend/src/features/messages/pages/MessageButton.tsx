import { MessageSquareIcon } from "lucide-react";


export function MessageButton() {
    return (
        <figure className="fixed bottom-5 right-5 rounded-full 
        p-4 bg-linear-to-r from-primary to-primary/50 shadow-lg
        hover:scale-105 transition-all duration-300">
            <MessageSquareIcon className="size-5" />
        </figure>
    );
}