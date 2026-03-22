// components/app-sidebar-layout.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
    Bell,
    Gauge,
    Wifi,
    WifiOff,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

// ─── Live Indicator ───────────────────────────────────────────────────────────

function LiveIndicator() {
    const [online, setOnline] = React.useState(true);

    React.useEffect(() => {
        // Sync with browser online/offline events
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
                <WifiOff className="w-3 h-3 text-red-500" />
                <span className="text-xs font-mono text-red-500 tracking-widest uppercase">
                    Offline
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono text-emerald-500 tracking-widest uppercase">
                Live
            </span>
        </div>
    );
}

// ─── Live Clock ───────────────────────────────────────────────────────────────

function LiveClock() {
    const { formatted } = useLiveClock("en-PH");

    // Render nothing until client mounts — avoids hydration mismatch
    if (!formatted) return null;

    return (
        <span className="text-xs text-muted-foreground font-mono hidden sm:block tabular-nums">
            {formatted}
        </span>
    );
}

// ─── Main Layout Component ────────────────────────────────────────────────────

interface AppSidebarLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: { label: string; href?: string }[];
    user: { name: string; email: string };
}

export function AppSidebarLayout({
    children,
    breadcrumbs = [],
    user,
}: AppSidebarLayoutProps) {
    const pathname = usePathname();
    const activeNav =
        [...navMain, ...navSettings].find((item) => item.href === pathname)?.title ?? "";

    return (
        <SidebarProvider >
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
                                        <SidebarMenuButton
                                            asChild
                                            isActive={activeNav === item.title}
                                            tooltip={item.title}
                                            className="h-10!"
                                        >
                                            <Link href={item.href}>
                                                <item.icon className="shrink-0" />
                                                <span className="font-oxygen text-[14px]! tracking-wide">
                                                    {item.title}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
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
                                        <SidebarMenuButton
                                            asChild
                                            isActive={activeNav === item.title}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarUser name={user.name} email={user.email} />
                </SidebarFooter>

            </Sidebar>

            <SidebarInset className="">
                {/* Top bar */}
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
                                        {crumb.href ? (
                                            <BreadcrumbLink href={crumb.href} className="text-sm">
                                                {crumb.label}
                                            </BreadcrumbLink>
                                        ) : (
                                            <BreadcrumbPage className="text-sm">
                                                {crumb.label}
                                            </BreadcrumbPage>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="ml-auto flex items-center gap-4">
                        <LiveIndicator />
                        <LiveClock />
                        <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
                            <Bell className="w-3 h-3" />
                            <Badge className="h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-red-500">
                                2
                            </Badge>
                        </Button>
                    </div>
                </header>

                {/* Page content */}
                <div className="flex flex-col gap-5 md:p-5 overflow-auto">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}