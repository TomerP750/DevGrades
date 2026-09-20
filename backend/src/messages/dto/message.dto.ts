import { IsNotEmpty, IsString } from "class-validator";
import { Expose, Type } from "class-transformer";
import { UserDto } from "../../users/dto/user.dto";


export class MessageDto {
    @Expose()
    @IsString()
    id!: string;

    @Expose()
    @IsString()
    content!: string;

    @Expose()
    @Type(() => UserDto)
    user!: UserDto;
    
    @Expose()
    @IsString()
    createdAt!: Date
}
