import { Socket } from "socket.io";
import { JwtPayload } from "./jwt-payload";

export type AuthenticatedSocket = Socket & {
    user: JwtPayload;
}