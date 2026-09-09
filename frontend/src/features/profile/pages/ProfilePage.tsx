import { useParams } from "react-router-dom";
import { dummyData as profileDummyData } from "../api/dummyData";
import { dummyData as projectDummyData } from "../../projects/api/dummyData";
import { ProfileAbout } from "../components/ProfileAbout";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileProjects } from "../components/ProfileProjects";
import { FeedNavbar } from "../../projects/pages/FeedNavbar";

export default function ProfilePage() {
    const { id } = useParams();
    const profile =
        profileDummyData.find(({ user }) => user.id === id) ?? profileDummyData[0];

    const featuredProjects = projectDummyData.slice(0, 3).map((project) => ({
        ...project,
        user: profile.user,
    }));

    return (
        <>
        <FeedNavbar />
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <ProfileHeader profile={profile} />

            <div className="mt-6 space-y-10">
                <ProfileAbout aboutBio={profile.aboutBio} />
                <ProfileProjects projects={featuredProjects} />
            </div>
        </main>
        </>
    );
}