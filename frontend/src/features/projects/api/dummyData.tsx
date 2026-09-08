import type { UserDto } from "../../../shared/models/UserDto";


export interface ProjectDto {
    id: string;
    name: string;
    user: UserDto;
    description: string;
    thumbnailUrl?: string;
    githubUrl?: string;
    demoUrl?: string;
    createdAt: Date;
}

export const dummyData: ProjectDto[] = [
    {
        id: "project-1",
        name: "Project One",
        user: {
            id: "user-1",
            firstName: "User",
            lastName: "One",
            username: "userone",
            email: "userone@example.com",
            avatarUrl: "",
            createdAt: new Date("2026-01-15"),
            updatedAt: new Date("2026-09-01"),
        },
        description: "Description for project one.",
        githubUrl: undefined,
        demoUrl: undefined,
        createdAt: new Date("2026-09-01"),
    },
    {
        id: "project-2",
        name: "Project Two",
        user: {
            id: "user-2",
            firstName: "User",
            lastName: "Two",
            username: "usertwo",
            email: "usertwo@example.com",
            avatarUrl: "",
            createdAt: new Date("2026-02-15"),
            updatedAt: new Date("2026-09-02"),
        },
        description: "Description for project two.",
        githubUrl: undefined,
        demoUrl: undefined,
        createdAt: new Date("2026-09-02"),
    },
    {
        id: "project-3",
        name: "Project Three",
        user: {
            id: "user-3",
            firstName: "User",
            lastName: "Three",
            username: "userthree",
            email: "userthree@example.com",
            avatarUrl: "",
            createdAt: new Date("2026-03-15"),
            updatedAt: new Date("2026-09-03"),
        },
        description: "Description for project three.",
        githubUrl: undefined,
        demoUrl: undefined,
        createdAt: new Date("2026-09-03"),
    },
    {
        id: "project-4",
        name: "Project Four",
        user: {
            id: "user-4",
            firstName: "User",
            lastName: "Four",
            username: "userfour",
            email: "userfour@example.com",
            avatarUrl: "",
            createdAt: new Date("2026-04-15"),
            updatedAt: new Date("2026-09-04"),
        },
        description: "Description for project four.",
        githubUrl: undefined,
        demoUrl: undefined,
        createdAt: new Date("2026-09-04"),
    },
    {
        id: "project-5",
        name: "Project Five",
        user: {
            id: "user-5",
            firstName: "User",
            lastName: "Five",
            username: "userfive",
            email: "userfive@example.com",
            avatarUrl: "",
            createdAt: new Date("2026-05-15"),
            updatedAt: new Date("2026-09-05"),
        },
        description: "Description for project five.",
        githubUrl: undefined,
        demoUrl: undefined,
        createdAt: new Date("2026-09-05"),
    },
    {
        id: "project-6",
        name: "Project Six",
        user: {
            id: "user-6",
            firstName: "User",
            lastName: "Six",
            username: "usersix",
            email: "usersix@example.com",
            avatarUrl: "",
            createdAt: new Date("2026-06-15"),
            updatedAt: new Date("2026-09-06"),
        },
        description: "Description for project six.",
        githubUrl: undefined,
        demoUrl: undefined,
        createdAt: new Date("2026-09-06"),
    },
];