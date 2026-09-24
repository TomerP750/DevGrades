import { Expose, Type } from "class-transformer";
import { IsString, IsNotEmpty, IsDate } from "class-validator";
import { UserDto } from "../../users/dto/user.dto";
import { MessageDto } from "../../messages/dto/message.dto";

export class ConversationDto {
    @Expose()
    @IsString()
    id!: string;

    @Expose()
    @IsDate()
    createdAt!: Date;

    @Expose()
    @Type(() => UserDto)
    users!: UserDto[];

    @Expose()
    @Type(() => MessageDto)
    messages!: MessageDto[];
    
}