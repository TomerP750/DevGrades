import { Link } from "react-router-dom";

interface LogoProps {
    isLink?: boolean;
    gradesClassName?: string;
}

export function Logo({ isLink = false, gradesClassName = "text-primary" }: LogoProps) {

    const logo = <h1>Dev<span className={`${gradesClassName}`}>Grades</span></h1>;
    if (isLink) {
        return <Link to="/">{logo}</Link>;
    }
    return logo;

}