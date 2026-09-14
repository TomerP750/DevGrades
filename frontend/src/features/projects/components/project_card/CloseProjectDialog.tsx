import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog } from "../../../../shared/ui/Dialog";
import projectService from "../../api/projectService";
import type { ProjectDto } from "../../models/ProjectDto";
import { Status } from "../../models/Status";

interface CloseProjectDialogProps {
    open: boolean;
    onClose: () => void;
    project: ProjectDto;
}

export function CloseProjectDialog({
    open,
    onClose,
    project,
}: CloseProjectDialogProps) {
    const queryClient = useQueryClient();

    const { mutate: closeProject, isPending } = useMutation({
        mutationFn: () =>
            projectService.updateProject(project.id, { status: Status.CLOSED }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["project", project.id] });
            onClose();
        },
        onError: (error) => {
            console.error(error);
        },
    });

    return (
        <Dialog
            isOpen={open}
            title={`Close ${project.name}?`}
            description="This marks the project as closed while keeping its details and existing feedback."
            variant="warning"
            confirmLabel="Close project"
            onCancel={onClose}
            onConfirm={() => closeProject()}
            isConfirming={isPending}
        />
    );
}
