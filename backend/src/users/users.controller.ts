import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CurrentUserId } from '../authentication/decorators/current-user.decorator';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {

  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findOneUser(id);
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
}
