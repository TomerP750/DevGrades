import { Link } from "react-router-dom";

interface LogoProps {
    isLink?: boolean;
    gradesClassName?: string;
    className?: string;
}

export function Logo({ isLink = false, gradesClassName = "text-primary", className = "" }: LogoProps) {

    const logo = <h1 className={className}>Dev<span className={`${gradesClassName}`}>Grades</span></h1>;
    if (isLink) {
        return <Link to="/" className={className}>{logo}</Link>;
    }
    return logo;

}