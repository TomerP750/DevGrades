import { Code2, ExternalLink, ImageIcon, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../shared/ui/Button";
import { Input } from "../../../../shared/ui/Input";
import { Modal } from "../../../../shared/ui/Modal";
import { TextArea } from "../../../../shared/ui/TextArea";
import type { UpdateProjectDto } from "../../models/UpdateProjectDto";
import type { ProjectDto } from "../../models/ProjectDto";

interface UpdateProjectModalProps {
    open: boolean;
    onClose: () => void;
    project: ProjectDto;
}

const URL_PATTERN = /^https?:\/\/.+/i;

export function UpdateProjectModal({
    open,
    onClose,
    project,
}: UpdateProjectModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdateProjectDto>({
        defaultValues: {
            name: project.name,
            description: project.description,
            githubUrl: project.githubUrl ?? "",
            demoUrl: project.demoUrl ?? "",
            thumbnailUrl: project.thumbnailUrl ?? "",
        },
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleUpdateProject = (data: UpdateProjectDto) => {
        console.log(data);
        handleClose();
    };

    return (
        <Modal
            isOpen={open}
            onClose={handleClose}
            title="Update project"
            className="max-w-xl rounded-xl"
        >
            <p className="mb-6 text-sm leading-6 text-muted-foreground">
                Update the details people see when they discover your project.
            </p>

            <form
                onSubmit={handleSubmit(handleUpdateProject)}
                className="space-y-5"
            >
                <Input
                    label="Project name"
                    autoFocus
                    error={errors.name?.message}
                    {...register("name", {
                        required: "Project name is required.",
                        minLength: {
                            value: 2,
                            message: "Project name must be at least 2 characters.",
                        },
                        maxLength: {
                            value: 80,
                            message: "Project name cannot exceed 80 characters.",
                        },
                    })}
                    required
                />

                <TextArea
                    label="Description"
                    rows={4}
                    error={errors.description?.message}
                    {...register("description", {
                        required: "Project description is required.",
                    })}
                    required
                />

                <Input
                    label="GitHub URL"
                    type="url"
                    leadingIcon={<Code2 className="size-[1.125rem]" />}
                    error={errors.githubUrl?.message}
                    {...register("githubUrl", {
                        pattern: {
                            value: URL_PATTERN,
                            message: "Enter a valid URL beginning with http:// or https://.",
                        },
                    })}
                />

                <Input
                    label="Live demo URL"
                    type="url"
                    leadingIcon={<ExternalLink className="size-[1.125rem]" />}
                    error={errors.demoUrl?.message}
                    {...register("demoUrl", {
                        pattern: {
                            value: URL_PATTERN,
                            message: "Enter a valid URL beginning with http:// or https://.",
                        },
                    })}
                />

                <Input
                    label="Thumbnail URL"
                    type="url"
                    leadingIcon={<ImageIcon className="size-[1.125rem]" />}
                    error={errors.thumbnailUrl?.message}
                    {...register("thumbnailUrl", {
                        pattern: {
                            value: URL_PATTERN,
                            message: "Enter a valid URL beginning with http:// or https://.",
                        },
                    })}
                />

                <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                    <Button type="button" variant="ghost" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        rightIcon={<Save className="size-4" />}
                        isLoading={isSubmitting}
                    >
                        Save changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
