import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { User } from "../../users/users.entity";

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    content!: string;

    @ManyToOne(() => User, { nullable: false })
    user!: User;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

}