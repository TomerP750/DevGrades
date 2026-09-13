import { MessageCircleIcon } from "lucide-react";
import { Badge } from "../../../shared/ui/Badge";
import type { ProfileDto } from "../models/ProfileDto";

interface ProfileHeaderProps {
    profile: ProfileDto;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {

    const { user } = profile;

    return (
        <header className="overflow-hidden">
            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/35 via-accent to-surface sm:h-56">
                {profile.bannerUrl && (
                    <img
                        src={profile.bannerUrl}
                        alt=""
                        className="size-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/15 to-transparent" />
            </div>

            <div className="px-5 pb-6 sm:px-8 sm:pb-8">
                <div className="-mt-12 flex flex-col items-start gap-4 sm:-mt-14 sm:flex-row sm:items-end">
                    <div className="relative z-10 grid size-24 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-card bg-primary text-2xl font-bold text-primary-foreground shadow-md sm:size-28">
                        <Badge user={user} />
                    </div>

                    <div className="min-w-0 w-full flex-1 pb-1 sm:translate-y-8">
                        <div className="flex items-center justify-between">
                            <h1 className="truncate text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">
                                {user.firstName} {user.lastName}
                            </h1>
                            <div className="flex gap-2">
                                <button className="border px-3 py-2 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                    <MessageCircleIcon className="size-4" />
                                    Message
                                </button>
                            </div>
                        </div>
                        <p className="mt-1 truncate text-sm font-medium text-muted-foreground sm:text-base">
                            @{user.username}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
