import { useParams } from "react-router-dom";
import NotFoundPage from "../../../shared/pages/NotFoundPage";
import { dummyData } from "../api/dummyData";
import { ProjectDetailsAside } from "../components/project_details_page/ProjectDetailsAside";
import { ProjectDetailsContent } from "../components/project_details_page/ProjectDetailsContent";
import { ProjectDetailsHeader } from "../components/project_details_page/ProjectDetailsHeader";

export default function ProjectDetailsPage() {

    const { id } = useParams();

    const project = dummyData.find((item) => item.id === id);

    if (!project) {
        return (
            <NotFoundPage />
        );
    }

    return (
        <article className="mt-4">
            <ProjectDetailsHeader project={project} />

            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16">
                <ProjectDetailsContent project={project} />
                <ProjectDetailsAside project={project} />
            </div>
        </article>
    );
}