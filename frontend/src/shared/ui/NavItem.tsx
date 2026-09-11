import { Link } from "react-router-dom";
import type { NavItem } from "../models/NavItem";

interface NavItemProps {
    item: NavItem;
}

const underlineClassName = 
"relative after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:origin-center after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:content-[''] group-hover:after:scale-x-100";


export function NavItem({ item }: NavItemProps) {
    return (
        <Link
            to={item.to}
            key={item.label}
            className="group flex items-center gap-1.5 px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3"
        >
            <item.Icon className="size-5" />
            <span className={underlineClassName}>{item.label}</span>
        </Link>
    )
}