import { Role } from "../../authentication/types/role"
import { IsString, IsEmail, IsOptional, IsEnum } from "class-validator"

export class UpdateUserDto {
    
    @IsString()
    @IsOptional()
    firstName?: string

    @IsString()
    @IsOptional()
    lastName?: string

    @IsString()
    @IsOptional()
    username?: string

    @IsEmail()
    @IsOptional()
    email?: string

    @IsEnum(Role)
    @IsOptional()
    role?: Role

    @IsString()
    @IsOptional()
    avatarUrl?: string
}