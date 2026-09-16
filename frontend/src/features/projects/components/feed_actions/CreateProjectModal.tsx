import { Code2, ExternalLink, Rocket } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../shared/ui/Button";
import { Input } from "../../../../shared/ui/Input";
import { Modal } from "../../../../shared/ui/Modal";
import type { CreateProjectDto } from "../../models/CreateProjectDto";
import { TextArea } from "../../../../shared/ui/TextArea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import projectService from "../../api/projectService";
import { toast } from "react-toastify";
import { resetProjectsFeed } from "../../hooks/useProjectsFeed";

interface CreateProjectModalProps {
    open: boolean;
    onClose: () => void;
}

const URL_PATTERN = /^https?:\/\/.+/i;

export function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
    
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateProjectDto>({
        defaultValues: {
            name: "",
            description: "",
            githubUrl: "",
            demoUrl: "",
        },
    });

    const { mutate: createProject } = useMutation({
        mutationFn: (data: CreateProjectDto) => projectService.createProject(data),
        onSuccess: () => {
            resetProjectsFeed(queryClient);
            handleClose();
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleCreateProject = (data: CreateProjectDto) => {
        if (!data.demoUrl || !data.githubUrl) {
            toast.error("At least one of the URLs is required.");
            return;
        }
        createProject(data);
    };

    return (
        <Modal
            isOpen={open}
            onClose={handleClose}
            title="Create a project"
            className="max-w-xl rounded-xl"
        >
            <p className="mb-6 text-sm leading-6 text-muted-foreground">
                Share what you have built and get feedback from other developers.
            </p>

            <form
                onSubmit={handleSubmit(handleCreateProject)}
                className="space-y-5"
                noValidate
            >
                <Input
                    label="Project name"
                    placeholder="My awesome project"
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
                    required
                    placeholder="What does your project do? What did you build it with?"
                    error={errors.description?.message}
                    {...register("description", {
                        required: "Project description is required.",
                    })}
                />

                <Input
                    label="GitHub URL"
                    type="url"
                    placeholder=""
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
                    placeholder=""
                    leadingIcon={<ExternalLink className="size-[1.125rem]" />}
                    error={errors.demoUrl?.message}
                    {...register("demoUrl", {
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
                        rightIcon={<Rocket className="size-4" />}
                        isLoading={isSubmitting}
                    >
                        Create project
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
