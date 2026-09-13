import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfileDto } from './dto/profile.dto';
import { Serialize } from '../shared/interceptors/serialize.interceptor';

@Controller('/api/profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}


  @Get("/:userId")
  @Serialize(ProfileDto)
  async getProfile(@Param('userId') userId: string) {
    return this.profilesService.findOneProfileByUserId(userId);
  }
}
