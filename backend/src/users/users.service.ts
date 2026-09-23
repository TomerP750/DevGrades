import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Like, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SignUpRequestDto } from '../authentication/dtos/signup.dto';
import { compare, hash } from 'bcrypt';
import { Role } from '../authentication/types/role';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private readonly profilesService: ProfilesService,
    ) {}

    async findOneUserById(id: string): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { id } });
    }

    async findOneUserByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { email } });
    }

    /** Returns `null` rather than throwing, so callers can answer with
     *  'invalid credentials' instead of revealing whether the email exists. */
    async findOneUserByEmailWithPassword(email: string): Promise<User | null> {
        return this.selectUserWithPassword()
            .where('user.email = :email', { email })
            .getOne();
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

        const savedUser = await this.usersRepository.save(user);
        await this.profilesService.createProfile(savedUser);
        return savedUser;
  
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.findOneUserById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        await this.usersRepository.update(id, updateUserDto);
    }

    async deleteUser(id: string) {
        const user = await this.findOneUserById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        await this.usersRepository.delete(id);
    }

    async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
        const user = await this.selectUserWithPassword()
            .where('user.id = :id', { id })
            .getOne();

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

    async searchUsers(query: string) {
        return await this.usersRepository.find({ where: { 
            username: Like(`%${query}%`) 
        } 
        });
    }

    /** `addSelect` re-adds the `select: false` password column on top of the
     *  default selection, so callers still get a fully hydrated `User`. */
    private selectUserWithPassword() {
        return this.usersRepository
            .createQueryBuilder('user')
            .addSelect('user.password');
    }
}
