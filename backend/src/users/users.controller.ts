import { Body, Controller, Delete, Get, Param, Patch, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CurrentUserId } from '../authentication/decorators/current-user.decorator';
import { Serialize } from '../shared/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('api/users')
@Serialize(UserDto)
export class UsersController {

  constructor(private readonly usersService: UsersService) { }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findOneUserById(id);
  }

  @Put('/update')
  async updateUser(@CurrentUserId() userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete('/delete')
  async deleteUser(@CurrentUserId() userId: string) {
    return this.usersService.deleteUser(userId);
  }

  @Patch("/change-password")
  async changePassword(@CurrentUserId() userId: string, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(userId, changePasswordDto);
  }

  @Get('/search')
  @Serialize(UserDto)
  async searchUsers(@Query('query') query: string) {
    return this.usersService.searchUsers(query);
  }

}
