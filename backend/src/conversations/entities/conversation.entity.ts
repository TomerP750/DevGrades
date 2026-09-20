import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, OneToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { User } from "../../users/users.entity";
import { Message } from "../../messages/entities/message.entity";

@Entity()
export class Conversation {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToMany(() => User, { nullable: false })
    @JoinTable({ name: 'conversation_users' })
    users!: User[];

    @OneToMany(() => Message, (message) => message.conversation)
    messages!: Message[];

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

}