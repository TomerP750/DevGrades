import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { FollowsModule } from '../follows/follows.module';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
  imports: [
    TypeOrmModule.forFeature([Profile]), 
    FollowsModule
  ],
  exports: [ProfilesService],
})
export class ProfilesModule {}
