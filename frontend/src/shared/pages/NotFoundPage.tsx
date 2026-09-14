import { ArrowLeft, Code2, Home, SearchX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-10 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle,var(--primary)_1.2px,transparent_1.2px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
        <div className="absolute -left-24 top-1/4 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-24 bottom-1/4 size-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <section className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/15">
        <div className="h-1 w-full bg-primary" />

        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md text-lg font-bold text-card-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            aria-label="DevGrades home"
          >
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Code2 aria-hidden="true" className="size-5" />
            </span>
            <span>
              Dev<span className="text-primary">Grades</span>
            </span>
          </Link>

          <div className="mt-12 grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-14">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                Error 404
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-card-foreground sm:text-5xl">
                This page didn&apos;t make the build.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
                The page may have been moved, renamed, or never existed. Let&apos;s
                get you back to somewhere useful.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-px motion-reduce:transition-none"
                >
                  <Home aria-hidden="true" className="size-4" />
                  Go to homepage
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  icon={<ArrowLeft className="size-4" />}
                >
                  Go back
                </Button>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="relative mx-auto grid size-44 shrink-0 place-items-center rounded-full border border-primary/20 bg-accent sm:size-52"
            >
              <div className="absolute inset-4 rounded-full border border-dashed border-primary/30" />
              <SearchX className="size-20 text-primary sm:size-24" strokeWidth={1.35} />
              <span className="absolute -right-2 top-2 rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs font-bold text-primary shadow-lg">
                404
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-surface px-6 py-4 text-center text-xs text-muted-foreground sm:px-10 sm:text-left">
          Lost in the codebase? The homepage is always a safe place to restart.
        </div>
      </section>
    </main>
  );
}


