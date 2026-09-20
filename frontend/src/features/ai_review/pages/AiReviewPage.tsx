import { useForm } from "react-hook-form";
import type { AiReviewProjectRequestDto } from "../models/AiReviewProjectRequestDto";
import { useQuery } from "@tanstack/react-query";
import projectService from "../../projects/api/projectService";
import { useAuth } from "../../authentication/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import type { ProjectDto } from "../../projects/models/ProjectDto";
import { Button } from "../../../shared/ui/Button";

export default function AiReviewPage() {

    const { user } = useAuth();

    if (!user?.id) {
        return <Navigate to="/auth/sign-in" />;
    }

    const { data: projects, isLoading, error } = useQuery<ProjectDto[]>({
        queryKey: ["ai-review-user-projects"],
        queryFn: () => projectService.getProjectsByUserId(user?.id),
    });

    const { register, handleSubmit, formState: { errors } } = useForm<AiReviewProjectRequestDto>();

    const handleReviewProject = async (data: AiReviewProjectRequestDto) => {
        console.log(data);
    }

    return (
        <div className="relative mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 lg:px-8">

            <div className="flex flex-col gap-5 items-center justify-center">
                <h1 className="text-transparent bg-clip-text 
                bg-gradient-to-r from-primary to-violet-500 
                text-5xl font-bold">
                    AI Project Review
                </h1>
                <form
                    className="flex flex-col gap-5 items-center justify-center"
                    onSubmit={handleSubmit(handleReviewProject)}>

                    <select {...register("githubUrl", {
                        required: "GitHub URL is required",
                    })}
                        name="project"
                        defaultValue=""
                        className="px-4 py-2 appearance-none rounded-md dark:bg-gray-800 dark:text-white"
                        id="project">
                        <option value="" disabled>Select a project</option>
                        {projects?.map((project) => (
                            <option
                                key={project.id}
                                className="dark:bg-gray-800 dark:text-white"
                                value={project.githubUrl}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                    {errors.githubUrl && <p className="text-red-500">{errors.githubUrl.message}</p>}

                    <Button
                        variant="unstyled"
                        className="cursor-pointer bg-linear-to-r from-primary to-violet-500 
                        px-4 py-2 rounded-full text-white 
                        hover:bg-linear-to-r hover:from-violet-500 hover:to-primary
                        transition-all duration-300 hover:scale-105
                        "
                        type="submit">
                        Review Project
                    </Button>

                </form>
            </div>
        </div>
    );
}