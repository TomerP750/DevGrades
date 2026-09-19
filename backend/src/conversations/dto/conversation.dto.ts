import { Expose, Type } from "class-transformer";
import { IsString, IsNotEmpty, IsDate } from "class-validator";
import { UserDto } from "../../users/dto/user.dto";

export class ConversationDto {
    @Expose()
    @IsString()
    id!: string;

    @Expose()
    @IsString()
    content!: string;

    @Expose()
    @IsDate()
    createdAt!: Date;

    @Expose()
    @Type(() => UserDto)
    user!: UserDto;
    
}