import type { UserDto } from "../../../shared/models/UserDto";

export class AuthResponseDto {
    constructor(
        public accessToken: string,
        public user: UserDto,
    ) {}
}