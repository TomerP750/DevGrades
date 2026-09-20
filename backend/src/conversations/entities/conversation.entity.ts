import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { User } from "../../users/users.entity";
import { Message } from "../../messages/entities/message.entity";

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    content!: string;

    @ManyToOne(() => User, { nullable: false })
    user!: User;

    //TODO db aggregation or object attribute?
    // @OneToOne(() => Message, { nullable: true })
    // @JoinColumn()
    // lastMessage!: Message | null;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

    

}