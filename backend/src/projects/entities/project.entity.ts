import { IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Status } from '../Status';
import { User } from '../../users/users.entity';

@Entity()
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    @IsString()
    name!: string;

    @Column()
    @IsString()
    description!: string;

    @Column()
    @IsString()
    githubUrl!: string;

    @Column()
    @IsString()
    demoUrl!: string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.OPEN,
    })
    status!: Status;

    @ManyToOne(() => User, { nullable: false })
    user!: User;

    @Column()
    @IsString()
    imageUrl!: string;
}
