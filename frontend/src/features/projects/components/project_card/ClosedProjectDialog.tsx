import { ArrowUpRightIcon, LockIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../../shared/ui/Button";
import type { ProjectDto } from "../../models/ProjectDto";
import { DeleteProjectDialog } from "./DeleteProjectDialog";


interface CloseProjectDialogProps {
    project: ProjectDto;
    isOwner: boolean;
}

export function ClosedProjectDialog({ project, isOwner }: CloseProjectDialogProps) {

    const [deleteProjectDialogOpen, setDeleteProjectDialogOpen] = useState(false);

    const projectPath = `/projects/${project.id}`;

    return (
        <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 p-5 backdrop-blur-[3px]"
            role="status"
            aria-label={`${project.name} is closed`}
        >
            <div className="flex w-full max-w-[17rem] flex-col items-center gap-3 rounded-xl border border-border/80 bg-card/95 px-5 py-6 text-center shadow-xl shadow-foreground/10">
                <div className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
                    <LockIcon aria-hidden="true" className="size-5" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-bold text-card-foreground">
                        Project closed
                    </p>
                    <p className="text-xs leading-5 text-muted-foreground">
                        This project is no longer accepting reviews.
                    </p>
                </div>
                <Link
                    to={projectPath}
                    className="mt-1 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                    View project
                    <ArrowUpRightIcon aria-hidden="true" className="size-4" />
                </Link>

                {isOwner && (
                    <div className="flex flex-col items-center gap-2">

                        <span className="uppercase tracking-widest text-xs text-muted-foreground">or</span>
                        <Button
                            variant="unstyled"
                            size="md"
                            className="cursor-pointer 
                                    w-full text-red-500 hover:text-red-600"
                            onClick={() => setDeleteProjectDialogOpen(true)}
                        >
                            Delete project
                        </Button>
                    </div>
                )}
                <DeleteProjectDialog
                    open={deleteProjectDialogOpen}
                    onClose={() => setDeleteProjectDialogOpen(false)}
                    project={project}
                />
            </div>
        </div>
    );
}