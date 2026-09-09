import type { UserDto } from "../../../shared/models/UserDto";

export interface Profile {
    bannerUrl: string;
    aboutBio: string;
    gitHubUrl: string;
    user: UserDto;
}