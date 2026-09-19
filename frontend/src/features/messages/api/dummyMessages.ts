import type { MessageDto } from "../models/MessageDto";
import { dummyUsers } from "./dummyUsers";

export const dummyMessages: MessageDto[] = [
    // Message example: example message only text
    {
        id: "1",
        content: "Example Message",
        user: dummyUsers[0],
        createdAt: new Date(),
    },
    {
        id: "2",
        content: "Example Message 2",
        user: dummyUsers[1],
        createdAt: new Date(),
    },
    {
        id: "3",
        content: "Example Message 3",
        user: dummyUsers[0],
        createdAt: new Date(),
    },
    {
        id: "4",
        content: "Example Message 4",
        user: dummyUsers[1],
        createdAt: new Date(),
    },
];