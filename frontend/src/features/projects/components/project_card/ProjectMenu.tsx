import {
    EllipsisVerticalIcon,
    PencilIcon,
    Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { Menu } from "../../../../shared/ui/Menu";
import type { ProjectDto } from "../../models/ProjectDto";
import { UpdateProjectModal } from "./UpdateProjectModal";


interface ProjectMenuProps {
    project: ProjectDto;
}

export function ProjectMenu({ project }: ProjectMenuProps) {
    
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

    return (
        <div className="relative flex justify-end">
            <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                aria-label={`Open actions for ${project.name}`}
                title="Project actions"
                className="cursor-pointer transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <EllipsisVerticalIcon
                    aria-hidden="true"
                    className="size-5"
                />
            </button>
            <Menu isOpen={isOpen} className="right-0 w-44 p-2">
                <div className="grid gap-1">
                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(false);
                            setIsUpdateModalOpen(true);
                        }}
                        className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <PencilIcon aria-hidden="true" className="size-4 text-muted-foreground" />
                        Update project
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(false);
                            console.log("Delete project", project.id);
                        }}
                        className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left text-sm font-medium text-danger transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <Trash2Icon aria-hidden="true" className="size-4" />
                        Delete project
                    </button>
                </div>
            </Menu>

            <UpdateProjectModal
                open={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                project={project}
            />
        </div>
    );
}
