import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Follow } from './entities/follow.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';

@Injectable()
export class FollowsService {

    constructor(
        @InjectRepository(Follow)
        private followRepository: Repository<Follow>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async follow(followerId: string, followedId: string): Promise<boolean> {
        if (followerId === followedId) {
            throw new BadRequestException('You cannot follow yourself');
        }
        const [follower, followed] = await Promise.all([
            this.userRepository.findOne({ where: { id: followerId } }),
            this.userRepository.findOne({ where: { id: followedId } }),
        ]);
        if (!follower || !followed) {
            throw new NotFoundException('User not found');
        }
        
        await this.followRepository.save({ follower, followed });
        return true;

    }

    async unfollow(followerId: string, followedId: string): Promise<boolean> {
        const follow = await this.followRepository.findOne({
            where: { follower: { id: followerId }, followed: { id: followedId } },
        });
        if (!follow) {
            return false;
        }
        await this.followRepository.delete(follow.id);
        return false; // false = not following
    }

    async getFollowers(userId: string): Promise<Follow[]> {
        return this.followRepository.find({
            where: { followed: { id: userId } },
            relations: { follower: true },
            order: { createdAt: 'DESC' },
        });
    }

    async getFollowings(userId: string): Promise<Follow[]> {
        return this.followRepository.find({
            where: { follower: { id: userId } },
            relations: { followed: true },
            order: { createdAt: 'DESC' },
        });
    }

    async isFollowing(followerId: string, followedId: string): Promise<boolean> {
        return this.followRepository.exists({
            where: { follower: { id: followerId }, followed: { id: followedId } },
        });
    }

    async getFollowersCount(userId: string): Promise<number> {
        return this.followRepository.count({
            where: { followed: { id: userId } },
        });
    }

    async getFollowingsCount(userId: string): Promise<number> {
        return this.followRepository.count({
            where: { follower: { id: userId } },
        });
    }
}
