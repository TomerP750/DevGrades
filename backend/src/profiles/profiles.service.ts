import { Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from './entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProfilesService {

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly usersService: UsersService,
  ) {}

  async createProfile(userId: string): Promise<void> {
    const user = await this.usersService.findOneUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newProfile: Omit<Profile, 'id'> = {
      user,
      bannerUrl: undefined,
      aboutBio: undefined,
    }
    const profile = this.profileRepository.create(newProfile);
    await this.profileRepository.save(profile);
  }
  

}
