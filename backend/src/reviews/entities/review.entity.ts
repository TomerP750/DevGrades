import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Project } from "../../projects/entities/project.entity";
import { User } from "../../users/users.entity";
import { IsNumber, IsString } from "class-validator";

@Entity()
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    @IsString()
    comment!: string;

    @Column()
    @IsNumber()
    overallScore!: number;

    @Column()
    @IsNumber()
    codeQualityScore!: number;

    @Column()
    @IsNumber()
    optimizationScore!: number;

    @Column()
    @IsNumber()
    maintainabilityScore!: number;

    @Column()
    @IsNumber()
    scalabilityScore!: number;

    @Column()
    @IsNumber()
    uiuxScore!: number;

    @ManyToOne(() => User, { nullable: false })
    user!: User;

    @ManyToOne(() => Project, { nullable: false })
    project!: Project;

}
