import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import type { UserDto } from "../../../shared/models/UserDto";
import { Button } from "../../../shared/ui/Button";
import projectService from "../../projects/api/projectService";
import type { ProjectDto } from "../../projects/models/ProjectDto";
import type { AiReviewProjectRequestDto } from "../models/AiReviewProjectRequestDto";

interface FormHeaderProps {
   user: UserDto;
   isLoadingResult: boolean;
   onSetDummyResult: () => void;
   onSetIsLoadingResult: (isLoading: boolean) => void;
}

export function FormHeader({ user, isLoadingResult, onSetDummyResult, onSetIsLoadingResult }: FormHeaderProps) {

    const { data: projects, isLoading, error } = useQuery<ProjectDto[]>({
        queryKey: ["ai-review-user-projects"],
        queryFn: () => projectService.getProjectsByUserId(user!.id),
        enabled: Boolean(user?.id),
    });

    const { register, handleSubmit, formState: { errors }, } = useForm<AiReviewProjectRequestDto>();

    const handleReviewProject = async (data: AiReviewProjectRequestDto) => {
        
        onSetIsLoadingResult(true);
        const timeout = setTimeout(() => {
            onSetDummyResult();
            onSetIsLoadingResult(false);
            clearTimeout(timeout);
        }, 3000);
    };

    return (
        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-20 sm:px-6 lg:px-8">
                <h1 className="uppercase tracking-wider bg-gradient-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text px-2 pb-3 text-center text-4xl font-bold leading-[1.3] text-transparent sm:text-6xl">
                    AI Project Review
                </h1>
                <p className="mt-3 max-w-md text-center text-sm leading-6 text-muted-foreground sm:text-base">
                    Choose one of your projects. The review scores code quality, optimization,
                    maintainability, scalability, and UI/UX.
                </p>

                <form
                    onSubmit={handleSubmit(handleReviewProject)}
                    className="mt-10 flex w-full max-w-sm flex-col items-center gap-5"
                >
                    <select
                        defaultValue=""
                        disabled={isLoading || Boolean(error)}
                        className="w-full appearance-none rounded-xl border-2 border-primary bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-[0_0_0_4px] shadow-primary/20 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/25 disabled:opacity-60"
                        {...register("githubUrl", {
                            // required: "GitHub URL is required",
                        })}
                    >
                        <option value="" disabled className="bg-accent text-muted-foreground">
                            {isLoading ? "Loading projects..." : "Select a project"}
                        </option>
                        {projects?.map((project) => (
                            <option
                                key={project.id}
                                value={project.githubUrl}
                                className="bg-accent font-medium text-accent-foreground"
                            >
                                {project.name}
                            </option>
                        ))}
                    </select>

                    {errors.githubUrl && (
                        <p className="text-sm text-danger">{errors.githubUrl.message}</p>
                    )}

                    <Button
                        type="submit"
                        variant="unstyled"
                        rightIcon={<Sparkles className="size-4" />}
                        className="min-w-sm inline-flex items-center gap-2 justify-center mt-5 
                        relative cursor-pointer overflow-hidden rounded-full 
                        bg-gradient-to-r from-primary via-indigo-500 to-violet-500 
                        hover:from-violet-500 hover:via-indigo-500 hover:to-primary
                        px-8 py-3 font-semibold text-white shadow-[0_16px_48px_-8px] 
                        shadow-indigo-500/50 transition-all duration-300 hover:scale-105 
                        hover:shadow-violet-500/50 focus-visible:outline-2 
                        focus-visible:outline-offset-2 focus-visible:outline-ring"
                        disabled={isLoadingResult}
                        isLoading={isLoadingResult}
                    >
                        {isLoadingResult ? "Reviewing Project" : "Review Project"}
                    </Button>
                </form>
            </div>
    );
}