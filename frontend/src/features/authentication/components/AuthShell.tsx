import type { ReactNode } from "react";
import { Code2 } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthShellProps {
  eyebrow: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({
  eyebrow,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="flex h-dvh items-center justify-center overflow-hidden bg-background px-4 py-8 sm:px-6 lg:py-12">
      <div className="grid max-h-[calc(100dvh-4rem)] w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-foreground/8 lg:max-h-[calc(100dvh-6rem)] lg:grid-cols-[minmax(20rem,0.85fr)_minmax(30rem,1.15fr)]">
        <aside className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:40px_40px]"
        />

        <Link
          to="/"
          className="relative flex w-fit items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground"
        >
          <span className="grid size-10 place-items-center rounded-lg bg-primary-foreground text-primary shadow-sm">
            <Code2 aria-hidden="true" className="size-5" strokeWidth={2.25} />
          </span>
          <span className="text-xl font-bold tracking-tight">DevGrades</span>
        </Link>

        <div className="relative max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/65">
            Feedback that ships
          </p>
          <h2 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.035em] xl:text-5xl">
            Your next improvement starts with an honest review.
          </h2>
        </div>

        <p className="relative text-xs text-primary-foreground/55">
          Built for developers who care about the details.
        </p>
        </aside>

        <section className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain px-5 py-8 [scrollbar-width:none] sm:px-10 sm:py-10 lg:max-h-[calc(100dvh-6rem)] lg:px-14 [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto w-full max-w-md">
            <Link
              to="/"
              className="mb-9 flex w-fit items-center gap-2 rounded-md text-lg font-bold text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring lg:hidden"
            >
              <Code2 aria-hidden="true" className="size-5 text-primary" />
              DevGrades
            </Link>

            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              {eyebrow}
            </p>
          

            <div className="mt-8">{children}</div>
            <div className="mt-7 border-t border-border pt-5 text-sm text-muted-foreground">
              {footer}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
