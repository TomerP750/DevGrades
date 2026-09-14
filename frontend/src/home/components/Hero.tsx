import { Link } from "react-router-dom";
import { Logo } from "../../shared/ui/Logo";
import { HeroContent } from "./hero/HeroContent";
import { ProjectSpotlightCard } from "./hero/ProjectSpotlightCard";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative z-50 border-b border-border">
        <div className="mx-auto flex min-h-16 w-full max-w-8xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <Logo isLink className="text-2xl font-bold" />
          <Link
            to="/sign-in"
            className="inline-flex min-h-9 items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Sign in
          </Link>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-20 h-80 bg-gradient-to-b from-accent/70 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute -top-28 right-[-8rem] -z-10 size-80 rounded-full bg-primary/10 blur-3xl sm:right-[-2rem] lg:size-[28rem]"
      />

      <div className="mx-auto grid max-w-8xl items-center gap-16 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20 lg:px-12 lg:py-14">
        <HeroContent />
        <ProjectSpotlightCard />
      </div>
    </section>
  );
}