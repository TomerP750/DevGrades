interface ProfileAboutProps {
    aboutBio: string;
}

export function ProfileAbout({ aboutBio }: ProfileAboutProps) {
    return (
        <section
            aria-labelledby="profile-about-heading"
            className="border-l-2 border-primary bg-surface px-5 py-6 sm:px-8"
        >
            <h2
                id="profile-about-heading"
                className="text-xl font-bold tracking-tight text-card-foreground"
            >
                About
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
                {aboutBio}
            </p>
        </section>
    );
}
