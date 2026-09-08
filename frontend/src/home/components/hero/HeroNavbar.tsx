import { Link } from "react-router-dom";
import { Logo } from "../../../shared/ui/Logo";

export function HeroNavbar() {
  return (
    <nav
      aria-label="Home navigation"
      className="relative z-50 border-b border-border"
    >
      <div className="mx-auto flex min-h-16 w-full max-w-8xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Logo isLink className="text-2xl font-bold" />

        <Link
          to="/sign-in"
          className="inline-flex min-h-9 items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Sign in
        </Link>
      </div>
    </nav>
  );
}