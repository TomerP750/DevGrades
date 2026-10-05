import { Expose } from 'class-transformer';
import { UserDto } from '../../users/dto/user.dto';

export class FollowDto {

    @Expose()
    id!: string;

    @Expose()
    follower!: UserDto;

    @Expose()
    followed!: UserDto;

    @Expose()
    createdAt!: Date;
}