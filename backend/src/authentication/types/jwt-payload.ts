import { Role } from "src/authentication/types/role"

export interface JwtPayload {
    sub: string
    email: string
    role: Role
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}