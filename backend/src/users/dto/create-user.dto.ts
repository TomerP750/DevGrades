import { Role } from "../../authentication/types/role"
import { IsString, IsEmail, IsEnum } from "class-validator" 

export class CreateUserDto {
    @IsString()
    firstName!: string

    @IsString()
    lastName!: string

    @IsString()
    username!: string

    @IsEmail()
    email!: string

    @IsEnum(Role)
    role!: Role

    @IsString()
    password!: string

    @IsString()
    confirmPassword!: string
}   