import { IsNotEmpty, IsString, IsUUID } from "class-validator";


export class CreateConversationDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    userId!: string;

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    recipientId!: string;

}