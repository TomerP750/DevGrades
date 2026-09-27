import { Expose, Type } from "class-transformer";
import { UserDto } from "../../users/dto/user.dto";

export class MessageCreatedDto {
    @Expose()
    id!: string;

    @Expose()
    content!: string;

    @Expose()
    @Type(() => UserDto)
    user!: UserDto;

    @Expose()
    createdAt!: Date;

    @Expose()
    conversationId!: string;

    @Expose()
    recipientId!: string;
}
