import type { UserDto } from "../../../shared/models/UserDto";

export interface AuthResponseDto {
    accessToken: string;
    user: UserDto;
}