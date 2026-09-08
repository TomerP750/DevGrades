import { Role } from "../../authentication/types/role"

export class UserDto {
    firstName!: string
    lastName!: string
    username!: string
    email!: string
    role!: Role
    password!: string
    avatarUrl?: string
}