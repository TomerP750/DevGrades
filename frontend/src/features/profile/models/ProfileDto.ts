import type { UserDto } from "../../../shared/models/UserDto";

export interface ProfileDto {
    bannerUrl: string;
    aboutBio: string;
    gitHubUrl: string;
    user: UserDto;
}