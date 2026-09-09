import { Entity, Column, CreateDateColumn, Index, PrimaryColumn } from "typeorm";

@Entity()
export class RefreshToken {

    @PrimaryColumn({ type: "char", length: 64 })
    tokenHash!: string;

    @Index()
    @Column()
    userId!: string;

    @Column()
    expiresAt!: Date;

    @Column()
    revoked!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

}
