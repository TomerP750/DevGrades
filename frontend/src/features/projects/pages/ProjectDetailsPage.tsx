import { useParams } from "react-router-dom";
import { dummyData } from "../api/dummyData";


export default function ProjectDetailsPage() {
   
    const { id } = useParams();

    const project = dummyData.find((project) => project.id === id);
    return (
        <div>
            <h1>{project?.name}</h1>
            <p>{project?.description}</p>
        </div>
    )
}