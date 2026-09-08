import { ArrowLeftIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import NotFoundPage from "../../../shared/pages/NotFoundPage";
import { dummyData } from "../api/dummyData";
import { ProjectDetailsAside } from "../components/project_details/ProjectDetailsAside";
import { ProjectDetailsContent } from "../components/project_details/ProjectDetailsContent";
import { ProjectDetailsHeader } from "../components/project_details/ProjectDetailsHeader";

export default function ProjectDetailsPage() {
    const { id } = useParams();

    const project = dummyData.find((item) => item.id === id);

    if (!project) {
        return (
            <NotFoundPage />
        );
    }

    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <Link
                to="/feed"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5" />
                All projects
            </Link>

            <article className="mt-8">
                <ProjectDetailsHeader project={project} />

                <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16">
                    <ProjectDetailsContent project={project} />
                    <ProjectDetailsAside project={project} />
                </div>
            </article>
        </main>
    );
}