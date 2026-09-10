import { Role } from "../../authentication/types/role"
import { Expose } from "class-transformer"

export class UserDto {
    @Expose()
    firstName!: string
    @Expose()
    lastName!: string
    @Expose()
    username!: string
    @Expose()
    email!: string
    @Expose()
    role!: Role
    @Expose()
    avatarUrl?: string
}