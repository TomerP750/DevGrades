import { User } from '../../users/users.entity';

export class InternalAuthResponseDto {
    constructor(
        public accessToken: string,
        public refreshToken: string,
        public user: User,
    ) {}
}