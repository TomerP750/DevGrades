import { IsString, MaxLength, MinLength } from "class-validator"

export class ChangePasswordDto {
    @IsString()
    oldPassword!: string

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    newPassword!: string

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    confirmNewPassword!: string
}