import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SignUpRequestDto } from '../authentication/dtos/signup.dto';
import { compare, hash } from 'bcrypt';
import { Role } from '../authentication/types/role';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) {}

    async findOneUser(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async findOneUserByEmail(email: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async createUser(createUserDto: SignUpRequestDto) {
        if (createUserDto.password !== createUserDto.confirmPassword) {
            throw new BadRequestException('Password and confirm password do not match');
        }

        const hashedPassword = await hash(createUserDto.password, 12);
        const user = this.usersRepository.create({
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            username: createUserDto.username,
            email: createUserDto.email,
            role: Role.USER,
            password: hashedPassword,
        });
        return await this.usersRepository.save(user);
        
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        await this.usersRepository.update(id, updateUserDto);
    }

    async deleteUser(id: string) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        await this.usersRepository.delete(id);
    }

    async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
        const user = await this.usersRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isOldPasswordCorrect = await compare(changePasswordDto.oldPassword, user.password);
        if (!isOldPasswordCorrect) {
            throw new BadRequestException('Old password is incorrect');
        }
        
        if (changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword) {
            throw new BadRequestException('New password and confirm new password do not match');
        }

        const hashedPassword = await hash(changePasswordDto.newPassword, 12);
        await this.usersRepository.update(id, { password: hashedPassword });
    }
}
