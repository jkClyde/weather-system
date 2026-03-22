// components/app-sidebar-layout.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Gauge } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { navMain, navSettings } from "@/constants/nav";
import { SidebarUser } from "./SidebarUser";
import { useLiveClock } from "@/hooks/use-live-clock";
import { NavigationLoader } from "./NavigationLoader";

// ─── Live indicator ───────────────────────────────────────────────────────────
function LiveIndicator() {
    const [online, setOnline] = React.useState(true);

    React.useEffect(() => {
        const handleOnline = () => setOnline(true);
        const handleOffline = () => setOnline(false);
        setOnline(navigator.onLine);
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (!online) {
        return (
            <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-red-500 tracking-widest uppercase">Offline</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono text-emerald-500 tracking-widest uppercase">Live</span>
        </div>
    );
}

// ─── Live clock ───────────────────────────────────────────────────────────────
function LiveClock() {
    const { formatted } = useLiveClock("en-PH");
    if (!formatted) return null;
    return (
        <span className="text-xs text-muted-foreground font-mono hidden sm:block tabular-nums">
            {formatted}
        </span>
    );
}

// ─── Nav link — closes mobile drawer + fires loader on click ─────────────────
function NavLink({
    href, title, icon: Icon, isActive,
}: {
    href: string; title: string;
    icon: React.ElementType; isActive: boolean;
}) {
    const { setOpenMobile, isMobile } = useSidebar();

    function handleClick() {
        if (isMobile) setOpenMobile(false);
        if (typeof window !== "undefined" && (window as any).__startNavLoader) {
            (window as any).__startNavLoader();
        }
    }

    return (
        <SidebarMenuButton asChild isActive={isActive} tooltip={title} className="h-10!">
            <Link href={href} onClick={handleClick}>
                <Icon className="shrink-0" />
                <span className="font-oxygen text-[14px] tracking-wide">{title}</span>
            </Link>
        </SidebarMenuButton>
    );
}

// ─── Main layout ──────────────────────────────────────────────────────────────
interface AppSidebarLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: { label: string; href?: string }[];
    user: { name: string; email: string };
}

export function AppSidebarLayout({ children, breadcrumbs = [], user }: AppSidebarLayoutProps) {
    const pathname = usePathname();
    const activeNav = [...navMain, ...navSettings].find(item => item.href === pathname)?.title ?? "";

    return (
        <SidebarProvider style={{ "--sidebar-width": "20rem" } as React.CSSProperties}>

            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" className="gap-3">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                    <Gauge className="size-4 text-emerald-500" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold text-sm">SensorGrid</span>
                                    <span className="text-[11px] text-muted-foreground font-mono">v1.0.0</span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel className="font-mono text-[10px] tracking-widest" />
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-2.5">
                                {navMain.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <NavLink href={item.href} title={item.title} icon={item.icon} isActive={activeNav === item.title} />
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup className="mt-auto">
                        <SidebarGroupLabel className="font-mono text-[10px] tracking-widest">
                            System
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navSettings.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <NavLink href={item.href} title={item.title} icon={item.icon} isActive={activeNav === item.title} />
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarUser name={user.name} email={user.email} />
                </SidebarFooter>

                <SidebarRail />
            </Sidebar>

            <SidebarInset className="md:m-4! ml-0!">
                <header className="flex h-17.5 shrink-0 items-center gap-3 border-b border-border/60 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="h-full" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#" className="text-muted-foreground text-sm">
                                    SensorGrid
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={index}>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        {crumb.href
                                            ? <BreadcrumbLink href={crumb.href} className="text-sm">{crumb.label}</BreadcrumbLink>
                                            : <BreadcrumbPage className="text-sm">{crumb.label}</BreadcrumbPage>
                                        }
                                    </BreadcrumbItem>
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="ml-auto flex items-center gap-4">
                        <LiveIndicator />
                        <LiveClock />
                    </div>
                </header>

                {/* Content area — loader is scoped inside here, not over the sidebar */}
                <div className="relative flex flex-col gap-5 md:p-5 overflow-auto flex-1">
                    <NavigationLoader />
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}