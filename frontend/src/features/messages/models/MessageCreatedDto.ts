import type { MessageDto } from "./MessageDto";

export interface MessageCreatedDto extends MessageDto {
    conversationId: string;
    recipientId: string;
}
