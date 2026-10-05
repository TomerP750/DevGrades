import { Body, Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { Serialize } from '../shared/interceptors/serialize.interceptor';
import { FollowDto } from './dtos/follow.dto';
import { AuthGuard } from '../authentication/guards/auth.guard';
import { CurrentUserId } from '../authentication/decorators/current-user.decorator';

@Controller('/api/follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {
  }

  @Post('/toggle')
  @UseGuards(AuthGuard)
  async toggleFollow(@Body() body: { followerId: string, followedId: string }): Promise<boolean> {
    return this.followsService.toggleFollow(body.followerId, body.followedId);
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
