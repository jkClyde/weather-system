// config/nav.ts
import {
    Activity,
    Bell,
    Database,
    FileText,
    Home,
    Settings,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavItem {
    title: string;
    icon: LucideIcon;
    href: string;
}

export const navMain: NavItem[] = [
    { title: "Dashboard", icon: Home, href: "/" },
    { title: "Data Input", icon: FileText, href: "/dashboard" },
    { title: "History", icon: Database, href: "/history" },
    { title: "Reports", icon: Activity, href: "/reports" },
];

export const navSettings: NavItem[] = [
    { title: "Alerts", icon: Bell, href: "/alerts" },
    { title: "Settings", icon: Settings, href: "/settings" },
];