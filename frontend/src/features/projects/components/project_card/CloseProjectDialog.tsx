import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog } from "../../../../shared/ui/Dialog";
import projectService from "../../api/projectService";
import type { ProjectDto } from "../../models/ProjectDto";
import { resetProjectsFeed } from "../../hooks/useProjectsFeed";
import { toast } from "react-toastify";

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
            projectService.closeProject(project.id),
        onSuccess: () => {
            toast.success("Project closed successfully");
            resetProjectsFeed(queryClient);
            queryClient.invalidateQueries({ queryKey: ["project", project.id] });
            onClose();
        },
        onError: (error) => {
            toast.error(error.message);
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
