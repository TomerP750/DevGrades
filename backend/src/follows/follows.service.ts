import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Follow } from './entities/follow.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { FollowDto } from './dtos/follow.dto';

@Injectable()
export class FollowsService {

    constructor(
        @InjectRepository(Follow)
        private followRepository: Repository<Follow>,
        private usersService: UsersService,
    ) {}

    async follow(followerId: string, followedId: string): Promise<boolean> {
        if (followerId === followedId) {
            throw new BadRequestException('You cannot follow yourself');
        }
        const [follower, followed] = await Promise.all([
            this.usersService.findOneUserById(followerId),
            this.usersService.findOneUserById(followedId),
        ]);
        if (!follower || !followed) {
            throw new NotFoundException('User not found');
        }
        const follow = await this.followRepository.findOne({
            where: { follower: { id: followerId }, followed: { id: followedId } },
        });

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
}
