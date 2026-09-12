import { useParams } from "react-router-dom";
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
        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <article className="mt-4">
                <ProjectDetailsHeader project={project} />

                <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16">
                    <ProjectDetailsContent project={project} />
                    <ProjectDetailsAside project={project} />
                </div>
            </article>
        </main>
    );
}