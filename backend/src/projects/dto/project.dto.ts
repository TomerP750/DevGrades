import { Status } from "../Status";
import { UserDto } from "../../users/dto/user.dto";
import { Expose, Type } from "class-transformer";

export class ProjectDto {
    @Expose()
    id!: string;
    @Expose()
    name!: string;
    @Expose()
    description!: string;
    @Expose()
    githubUrl!: string;
    @Expose()
    demoUrl!: string;
    @Expose()
    status!: Status;
    @Expose()
    imageUrl!: string;
    @Expose()
    @Type(() => UserDto)
    user!: UserDto;
    @Expose()
    createdAt!: Date;
}