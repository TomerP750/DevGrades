import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { JwtPayload } from "../types/jwt-payload";
import { AuthenticatedSocket } from "../types/authenticated-socket";
import { ConfigService } from "@nestjs/config";

const IS_PUBLIC_KEY = 'isPublic';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService, 
        private readonly reflector: Reflector,
        private readonly configService: ConfigService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const { token, setUser } = this.getAuthContext(context);

        if (!token) {
            throw new UnauthorizedException('Unauthorized');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
            });
            setUser(payload);
        } catch (error) {
            throw new UnauthorizedException('Unauthorized');
        }
        return true;
    }

    private getAuthContext(context: ExecutionContext) {
        if (context.getType() === 'ws') {
            const client = context.switchToWs().getClient<AuthenticatedSocket>();

            return {
                token: client.handshake.auth?.token,
                setUser: (payload: JwtPayload) => {
                    client.user = payload;
                },
            };
        }

        const request = context.switchToHttp().getRequest<Request>();

        return {
            token: this.extractTokenFromHeader(request),
            setUser: (payload: JwtPayload) => {
                request.user = payload;
            },
        };
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
    
}

