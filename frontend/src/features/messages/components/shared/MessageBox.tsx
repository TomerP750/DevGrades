import { formatTimeAgo } from "../../../../shared/utils/formatTimeAgo";
import type { ConversationDto } from "../../models/ConversationDto";
import type { MessageDto } from "../../models/MessageDto";


interface MessageBoxProps {
    message: MessageDto;
    conversation: ConversationDto;
}

export function MessageBox({ message, conversation }: MessageBoxProps) {

    const isMessageOwner = message.user.id === conversation.users[0].id;

    return (
        <li
            key={message.id}
            className={`flex ${isMessageOwner ? "justify-end" : "justify-start"}`}
        >
            <p
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-5 ${isMessageOwner
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-muted text-foreground"
                    }`}
            >
                {message.content}
                <span
                    className={`mt-1 block text-[10px] font-medium ${isMessageOwner
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                >
                    {formatTimeAgo(message.createdAt)}
                </span>
            </p>
        </li>
    )
}