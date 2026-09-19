import type { UserDto } from "../../../shared/models/UserDto";

// Empty string for imageurl and avatarurl and name user one username userone
export const dummyUsers: UserDto[] = [
    {
        id: "1",
        firstName: "user",
        lastName: "one",
        username: "userone",
        email: "userone@example.com",
        avatarUrl: "",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "2",
        firstName: "user",
        lastName: "two",
        username: "usertwo",
        email: "usertwo@example.com",
        avatarUrl: "",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];