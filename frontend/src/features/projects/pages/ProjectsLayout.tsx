import { Outlet } from "react-router-dom";
import { dummyData } from "../api/dummyData";
import { FeedNavbar } from "./FeedNavbar";

export function ProjectsLayout() {
    return (
        <>
            <FeedNavbar user={dummyData[0].user} />
            <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </>
    );
}
