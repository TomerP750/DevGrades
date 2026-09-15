import { LinkIcon, MessageCircleIcon } from "lucide-react";
import { Badge } from "../../../shared/ui/Badge";
import { Button } from "../../../shared/ui/Button";
import type { ProfileDto } from "../models/ProfileDto";
import { Link } from "react-router-dom";
import { useAuth } from "../../authentication/contexts/AuthContext";

interface ProfileHeaderProps {
    profile: ProfileDto;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {

    const { user: loggedInUser } = useAuth();
    const { user: profileUser } = profile;

    const isOwner = loggedInUser?.id === profileUser.id;

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
            </div>

            <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
                <div className="absolute -top-12 left-5 z-10 grid size-24 place-items-center overflow-hidden rounded-full border-4 border-card bg-primary text-2xl font-bold text-primary-foreground shadow-md sm:-top-14 sm:left-8 sm:size-28">
                    <Badge user={profileUser} />
                </div>

                <div className="min-w-0 w-full pt-16 sm:pl-32 sm:pt-4">
                    <div className="flex items-center justify-between">
                        <h1 className="truncate text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">
                            {profileUser.firstName} {profileUser.lastName}
                        </h1>
                        <div className="flex gap-2">
                            {!isOwner && (
                            <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                className="min-h-10 shrink-0 rounded-full px-4 shadow-md shadow-primary/20"
                                leftIcon={
                                    <MessageCircleIcon
                                        className="size-4"
                                        strokeWidth={2.25}
                                    />
                                }
                            >
                                    Message
                                </Button>
                            )}
                        </div>
                    </div>
                    <p className="truncate text-sm font-medium text-muted-foreground sm:text-base">
                        @{profileUser.username}
                    </p>
                    {/* links */}
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-center gap-2">
                            <LinkIcon className="size-4" />
                            <Link to="/" className="text-sm text-muted-foreground">
                                link1
                            </Link>
                        </div>
                        <div className="flex items-center gap-2">
                            <LinkIcon className="size-4" />
                            <Link to="/" className="text-sm text-muted-foreground">
                                link2
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
