import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog } from "../../../../shared/ui/Dialog";
import projectService from "../../api/projectService";
import type { ProjectDto } from "../../models/ProjectDto";

interface DeleteProjectDialogProps {
    open: boolean;
    onClose: () => void;
    project: ProjectDto;
}

export function DeleteProjectDialog({
    open,
    onClose,
    project,
}: DeleteProjectDialogProps) {
    const queryClient = useQueryClient();

    const { mutate: deleteProject, isPending } = useMutation({
        mutationFn: () => projectService.deleteProject(project.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.removeQueries({ queryKey: ["project", project.id] });
            onClose();
        },
        onError: (error) => {
            console.error(error);
        },
    });

    return (
        <Dialog
            isOpen={open}
            title={`Delete ${project.name}?`}
            description="This permanently deletes the project and all of its reviews. This action cannot be undone."
            variant="danger"
            confirmLabel="Delete project"
            onCancel={onClose}
            onConfirm={() => deleteProject()}
            isConfirming={isPending}
        />
    );
}
