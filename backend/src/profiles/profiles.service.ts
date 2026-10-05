import { Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from './entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { FollowsService } from '../follows/follows.service';

@Injectable()
export class ProfilesService {

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly followsService: FollowsService,
  ) {}

  async findOneProfileByUserId(userId: string): Promise<Profile & { followerCount: number, followingCount: number }> {
    const profile = await this.profileRepository.findOne({ 
      where: { 
        user: { id: userId } },
        relations: { user: true }
      });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const [followersCount, followingsCount] = await Promise.all([
      this.followsService.getFollowersCount(userId),
      this.followsService.getFollowingsCount(userId),
    ]);
  
    return { ...profile, 
      followerCount: followersCount, 
      followingCount: followingsCount
     };
  }

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
