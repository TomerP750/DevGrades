import { UserDto } from "src/users/dto/user.dto";


export interface AuthResponseDto {
    accessToken: string;
    user: UserDto;
}