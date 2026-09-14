import { BrainCog, NewspaperIcon, Settings, UserRound } from "lucide-react";
import type { NavItem } from "../../../shared/models/NavItem";


export const navItems: NavItem[] = [
    {
        label: "Feed",
        to: "/",
        Icon: NewspaperIcon
    },
    {
        label: "AI Review",
        to: "/ai-review",
        Icon: BrainCog
    },
]



export const deviceNavItems = (userId: string): NavItem[] => [
    {
        label: "Feed",
        to: "/",
        Icon: NewspaperIcon
    },
    {
        label: "Settings",
        to: "/settings",
        Icon: Settings
    },
    {
        label: "Profile",
        to: `/u/${userId}`,
        Icon: UserRound
    }
    
]