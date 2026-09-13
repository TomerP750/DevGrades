import { useParams } from "react-router-dom";
import { ProfileAbout } from "../components/ProfileAbout";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileProjects } from "../components/ProfileProjects";
import { useQuery } from "@tanstack/react-query";
import profileService from "../api/profileService";
import NotFoundPage from "../../../shared/pages/NotFoundPage";


export default function ProfilePage() {

    const { id } = useParams();

    if (!id) {
        return <NotFoundPage />;
    }

    const { data: profile } = useQuery({
        queryKey: ["profile", id],
        queryFn: () => profileService.getProfile(id),
    })

    return (
  
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <ProfileHeader profile={profile} />

            <div className="mt-6 space-y-10">
                <ProfileAbout aboutBio={profile.aboutBio} />
                {/* <ProfileProjects projects={featuredProjects} /> */}
            </div>
        </main>
       
    );
}