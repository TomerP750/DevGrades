import { HeroContent } from "./hero/HeroContent";
import { ProjectSpotlightCard } from "./hero/ProjectSpotlightCard";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-20">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-20 h-80 bg-gradient-to-b from-accent/70 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute -top-28 right-[-8rem] -z-10 size-80 rounded-full bg-primary/10 blur-3xl sm:right-[-2rem] lg:size-[28rem]"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
        <HeroContent />
        <ProjectSpotlightCard />
      </div>
    </section>
  );
}