import type { ReactNode } from "react";
import { Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "../../../shared/ui/Logo";

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
    <main className="relative isolate flex h-dvh items-center justify-center overflow-hidden bg-background px-4 py-8 sm:px-6 lg:py-12">
      {/* Background effects */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-3/4 opacity-[0.14] [background-image:radial-gradient(circle,var(--primary)_1.25px,transparent_1.25px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute left-[8%] top-[18%] size-40 rounded-full border border-primary/20" />
        <div className="absolute bottom-[12%] right-[7%] size-56 rounded-full border border-primary/15" />
        <div className="absolute -left-16 bottom-[8%] h-24 w-64 -rotate-12 border-y border-primary/15 bg-primary/5" />
        <div className="absolute -right-20 top-[12%] h-28 w-72 rotate-12 border-y border-primary/15 bg-primary/5" />
      </div>

      <div className="relative z-10 grid max-h-[calc(100dvh-4rem)] w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/30 lg:max-h-[calc(100dvh-6rem)] lg:grid-cols-[minmax(20rem,0.85fr)_minmax(30rem,1.15fr)]">
        <aside className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:40px_40px]"
        />

        <Logo isLink={true} gradesClassName="text-primary-foreground" />

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

        <section className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain px-5 py-8 sm:px-10 sm:py-10 lg:max-h-[calc(100dvh-6rem)] lg:px-14 ">
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
