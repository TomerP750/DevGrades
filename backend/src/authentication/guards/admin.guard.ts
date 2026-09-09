import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../types/role";
import { UsersService } from "../../users/users.service";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import type { JwtPayload } from "../types/jwt-payload";

const IS_ADMIN_KEY = 'isAdmin';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isAdminOnly = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!isAdminOnly) {
            return true;
        }

        const request: Request = context.switchToHttp().getRequest();

        let payload = request.user;
        if (!payload) {
            const token = this.extractTokenFromHeader(request);
            if (!token) {
                throw new UnauthorizedException('Unauthorized');
            }
            try {
                payload = await this.jwtService.verifyAsync<JwtPayload>(token);
                request.user = payload;
            } catch (error) {
                throw new UnauthorizedException('Unauthorized');
            }
        }

        const user = await this.usersService.findOneUser(payload!.sub);
        if (!user) {
            throw new UnauthorizedException('Unauthorized');
        }

        return user.role === Role.ADMIN;

    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
    
}