import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUserId } from '../authentication/decorators/current-user.decorator';
import { AuthGuard } from '../authentication/guards/auth.guard';
import { Serialize } from '../shared/interceptors/serialize.interceptor';
import { FollowDto } from './dtos/follow.dto';
import { FollowsService } from './follows.service';

@Controller('/api/follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {
  }

  @Post('/follow/:followedId')
  @UseGuards(AuthGuard)
  async follow(
    @CurrentUserId() userId: string,
    @Param('followedId') followedId: string): Promise<boolean> {
    return this.followsService.follow(userId, followedId);
  }

  @Delete('/unfollow/:followedId')
  @UseGuards(AuthGuard)
  async unfollow(@CurrentUserId() userId: string, @Param('followedId') followedId: string): Promise<boolean> {
    return this.followsService.unfollow(userId, followedId);
  }

  @Get('/followers/:userId')
  @Serialize(FollowDto)
  @UseGuards(AuthGuard)
  async getFollowers(@Param('userId') userId: string): Promise<FollowDto[]> {
    return this.followsService.getFollowers(userId);
  }

  @Get('/followings/:userId')
  @Serialize(FollowDto)
  @UseGuards(AuthGuard)
  async getFollowings(@Param('userId') userId: string): Promise<FollowDto[]> {
    return this.followsService.getFollowings(userId);
  }

  @Get("/is-following/:followedId")
  @UseGuards(AuthGuard)
  async isFollowing(
    @Param('followedId') followedId: string,
    @CurrentUserId() userId: string): Promise<boolean> {
    return this.followsService.isFollowing(userId, followedId);
  }
}
