import { Expose, Type } from "class-transformer";
import { UserDto } from "../../users/dto/user.dto";


export class ProfileDto {
    @Expose()
    id!: string;

    @Expose()
    @Type(() => UserDto)
    user!: UserDto;

    @Expose()
    bannerUrl?: string;
    
    @Expose()
    aboutBio?: string;
}