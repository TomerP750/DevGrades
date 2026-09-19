import type { UserDto } from "../../../shared/models/UserDto";
import type { MessageDto } from "./MessageDto";


export interface ConversationDto {
    id: string;
    name: string;
    lastMessage: MessageDto | null;
    messages: MessageDto[];
    users: UserDto[];
}