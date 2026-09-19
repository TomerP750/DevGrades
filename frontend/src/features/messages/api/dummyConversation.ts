import type { ConversationDto } from "../models/ConversationDto";
import { dummyUsers } from "./dummyUsers";

export const dummyConversations: ConversationDto[] = [
    {
        id: "1",
        name: "Example Name",
        lastMessage: null,
        messages: [],
        users: dummyUsers,
    },
    {
        id: "2",
        name: "Example Name 2",
        lastMessage: null,
        messages: [],
        users: dummyUsers,
    },
];