import { Injectable } from '@nestjs/common';
import { Profile } from './entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';

@Injectable()
export class ProfilesService {

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async createProfile(user: User): Promise<void> {
    const newProfile: Omit<Profile, 'id'> = {
      user,
      bannerUrl: undefined,
      aboutBio: undefined,
    }
    const profile = this.profileRepository.create(newProfile);
    await this.profileRepository.save(profile);
  }
  

}
