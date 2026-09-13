import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../users/users.entity';

@Entity()
export class Profile {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToOne(() => User, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column({ nullable: true })
    bannerUrl?: string;

    @Column({ nullable: true })
    aboutBio?: string;
    


}
