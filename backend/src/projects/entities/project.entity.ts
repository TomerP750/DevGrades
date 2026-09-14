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

    //TODO remove the default empty string
    @Column({default: ''})
    @IsString()
    description!: string;

    @Column({default: ''})
    @IsString()
    // @IsUrl()
    githubUrl!: string;

    @Column({default: ''})
    @IsString()
    // @IsUrl()
    demoUrl!: string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.OPEN,
    })
    status!: Status;

    @ManyToOne(() => User, { nullable: false })
    user!: User;

    @Column({default: ''})
    @IsString()
    imageUrl!: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}
