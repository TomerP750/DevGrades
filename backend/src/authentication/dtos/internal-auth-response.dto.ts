import { User } from "src/users/users.entity";


export interface InternalAuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: User;
}