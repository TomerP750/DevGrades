import {
    EllipsisVerticalIcon,
    LockIcon,
    PencilIcon,
    Trash2Icon
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Menu } from "../../../../shared/ui/Menu";
import type { ProjectDto } from "../../models/ProjectDto";
import { UpdateProjectModal } from "./UpdateProjectModal";
import { CloseProjectDialog } from "./CloseProjectDialog";
import { DeleteProjectDialog } from "./DeleteProjectDialog";

interface ProjectMenuProps {
    project: ProjectDto;
    isOwner: boolean;
    isClosed: boolean;
}

export function ProjectMenu({ project, isOwner, isClosed }: ProjectMenuProps) {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState<boolean>(false);
    const [isCloseProjectModalOpen, setIsCloseProjectModalOpen] = useState<boolean>(false);

    if (!isOwner) {
        return null;
    }

    return (
        <div className="relative flex justify-end">
            <Button
                type="button"
                variant="unstyled"
                onClick={() => setIsOpen(prev => !prev)}
                aria-label={`Open actions for ${project.name}`}
                title="Project actions"
                className="cursor-pointer transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                leftIcon={<EllipsisVerticalIcon className="size-5" />}
            />
            <Menu isOpen={isOpen} className="right-0 w-44 p-2 rounded-lg shadow-lg">
                <div className="grid gap-1">
                    <Button
                        type="button"
                        variant="unstyled"
                        onClick={() => {
                            setIsOpen(false);
                            setIsUpdateModalOpen(true);
                        }}
                        className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        leftIcon={<PencilIcon className="size-4 text-muted-foreground" />}
                    >
                        Update project
                    </Button>
                    {!isClosed && <Button
                        type="button"
                        variant="unstyled"
                        onClick={() => {
                            setIsOpen(false);
                            setIsCloseProjectModalOpen(true);
                        }}
                        className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        leftIcon={<LockIcon className="size-4" />}
                    >
                        Close project
                    </Button>
                    }
                    <Button
                        type="button"
                        variant="unstyled"
                        onClick={() => {
                            setIsOpen(false);
                            setIsDeleteProjectModalOpen(true);
                        }}
                        className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left text-sm font-medium text-danger transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        leftIcon={<Trash2Icon className="size-4" />}
                    >
                        Delete project
                    </Button>
                </div>
            </Menu>

            <UpdateProjectModal
                open={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                project={project}
            />
            <CloseProjectDialog
                open={isCloseProjectModalOpen}
                onClose={() => setIsCloseProjectModalOpen(false)}
                project={project}
            />
            <DeleteProjectDialog
                open={isDeleteProjectModalOpen}
                onClose={() => setIsDeleteProjectModalOpen(false)}
                project={project}
            />
        </div>
    );
}
