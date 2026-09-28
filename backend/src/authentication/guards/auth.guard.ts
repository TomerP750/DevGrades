import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { AuthenticationService } from "../authentication.service";
import { AuthenticatedSocket } from "../types/authenticated-socket";
import { JwtPayload } from "../types/jwt-payload";

const IS_PUBLIC_KEY = 'isPublic';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        private readonly authenticationService: AuthenticationService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const { token, setUser } = this.getAuthContext(context);
        const payload = await this.authenticationService.verifyAccessToken(token);
        setUser(payload);
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

