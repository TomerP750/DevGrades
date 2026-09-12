import { IsString, IsUrl } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Status } from '../Status';
import { User } from '../../users/users.entity';

@Entity()
@Index('IDX_project_feed_cursor', ['createdAt', 'id'])
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
    @IsUrl()
    githubUrl!: string;

    @Column()
    @IsString()
    @IsUrl()
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

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}
