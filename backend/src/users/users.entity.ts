import { IsEmail, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, VersionColumn } from "typeorm";
import { Role } from "../authentication/types/role";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    @IsString()
    firstName!: string

    @Column()
    @IsString()
    lastName!: string

    @Column()
    @IsString()
    username!: string

    @Column()
    @IsEmail()
    email!: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.USER,
    })
    role!: Role;

    /** Never selected by default, so a forgotten response DTO cannot leak it.
     *  Read it through `UsersService`'s `*WithPassword` finders. */
    @Column({ select: false })
    @IsString()
    password!: string;

    @Column({ nullable: true })
    @IsString()
    avatarUrl?: string

    @VersionColumn()
    version!: number;
}