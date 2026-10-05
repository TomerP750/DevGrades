import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique, Index } from 'typeorm';
import { User } from '../../users/users.entity';

@Entity('follows')
@Unique('UQ_follow_pair', ['follower', 'followed'])
@Index('IDX_follow_followed', ['followed'])
export class Follow {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'follower_id'})
    follower!: User;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'followed_id' })
    followed!: User;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

}