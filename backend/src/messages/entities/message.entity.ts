import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "../../users/users.entity";
import { Conversation } from "../../conversations/entities/conversation.entity";

@Entity("messages")
export class Message {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    content!: string;

    @ManyToOne(() => User, { nullable: false })
    user!: User;

    @ManyToOne(() => Conversation, { nullable: false })
    conversation!: Conversation;

    @CreateDateColumn()
    createdAt!: Date;
    
}
