import { SetMetadata } from "@nestjs/common";

export const IsAdmin = () => SetMetadata('isAdmin', true);