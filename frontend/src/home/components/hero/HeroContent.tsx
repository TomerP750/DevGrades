import { Check } from "lucide-react";
import { Button } from "../../../shared/ui/Button";
import { Link } from "react-router-dom";

const reviewCategories = ["UI/UX", "Performance", "Maintainability", "Accessibility", "And More"];

export function HeroContent() {
  return (
    <div className="max-w-2xl">
      <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-3.5 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-40" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        Better feedback. Better projects.
      </div>

      <h1 className="text-balance text-5xl font-bold tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
        Build something great.
        <span className="mt-1 block text-primary">Get graded by builders.</span>
      </h1>

      <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
        Share your project with a community of developers and get useful ratings
        on UI/UX, performance, accessibility, and more.
      </p>

      <Link to="/sign-up"><Button variant="primary" className="mt-5">
        Get Started
      </Button></Link>

{/* TODO remove this later */}
      <Link to="/feed"><Button variant="primary" className="mt-5">
        Feed
      </Button></Link>

      <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-muted-foreground">
        {reviewCategories.map((category) => (
          <span key={category} className="flex items-center gap-2">
            <Check
              aria-hidden="true"
              className="size-4 text-primary"
              strokeWidth={2.25}
            />
            {category}
          </span>
        ))}
      </div>
    </div>
  );
}
