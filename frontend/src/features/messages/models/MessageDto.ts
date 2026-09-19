import type { UserDto } from "../../../shared/models/UserDto";


export interface MessageDto {
    id: string;
    content: string;
    user: UserDto;
    createdAt: Date;
}