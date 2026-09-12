import { BrainCog, NewspaperIcon } from "lucide-react";
import type { NavItem } from "../../../shared/models/NavItem";


export const navItems: NavItem[] = [
    {
        label: "Feed",
        to: "/feed",
        Icon: NewspaperIcon
    },
    {
        label: "AI Review",
        to: "/ai-review",
        Icon: BrainCog
    },
]