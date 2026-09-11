import { BrainCog, LayoutDashboardIcon } from "lucide-react";
import type { NavItem } from "../../../shared/models/NavItem";


export const navItems: NavItem[] = [
    {
        label: "Projects",
        to: "/projects",
        Icon: LayoutDashboardIcon
    },
    {
        label: "AI Review",
        to: "/ai-review",
        Icon: BrainCog
    },
]