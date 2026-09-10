import { Expose, Type } from 'class-transformer';
import { UserDto } from '../../users/dto/user.dto';

export class AuthResponseDto {
    @Expose()
    accessToken: string;

    @Expose()
    @Type(() => UserDto)
    user: UserDto;

    constructor(accessToken: string, user: UserDto) {
        this.accessToken = accessToken;
        this.user = user;
    }
}