import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/users.entity";
import { Project } from "../../projects/entities/project.entity";

@Entity()
@Index(["user", "project"], { unique: true })
export class ArchivedProject {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User)
    user!: User;

    @ManyToOne(() => Project)
    project!: Project;
}
