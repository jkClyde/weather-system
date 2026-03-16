// components/app-sidebar-layout.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
    Activity,
    Bell,
    ChevronDown,
    Database,
    FileText,
    Gauge,
    Home,
    Settings,
    Circle,
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

// ─── Nav Items (moved here for global use) ─────────────────────────────────────

const navMain = [
    { title: "Dashboard", icon: Home, href: "/", isActive: true },
    { title: "Data Input", icon: FileText, href: "/dashboard", isActive: false },
    { title: "History", icon: Database, href: "/history", isActive: false },
    { title: "Reports", icon: Activity, href: "/reports", isActive: false },
];

const navSettings = [
    { title: "Alerts", icon: Bell, href: "/alerts", isActive: false },
    { title: "Settings", icon: Settings, href: "/settings", isActive: false },
];

// ─── Live Indicator Sub-component ─────────────────────────────────────────────

function LiveIndicator() {
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

// ─── Main Layout Component ────────────────────────────────────────────────────

interface AppSidebarLayoutProps {
    children: React.ReactNode;
    activeNav?: string;
    breadcrumbs?: { label: string; href?: string }[];
}

export function AppSidebarLayout({ children, activeNav = "Overview", breadcrumbs = [] }: AppSidebarLayoutProps) {
    const now = new Date().toLocaleString("en-PH", {
        weekday: "short", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
    });

    return (
        <SidebarProvider>
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
                        <SidebarGroupLabel className="font-mono text-[10px] tracking-widest">
                            Navigation
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navMain.map((item) => (
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
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" className="gap-3">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                                    <Circle className="size-4 fill-current text-muted-foreground" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold text-sm">Thesis Admin</span>
                                    <span className="text-[11px] text-muted-foreground">admin@thesis.edu</span>
                                </div>
                                <ChevronDown className="ml-auto size-4 text-muted-foreground" />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>

                <SidebarRail />
            </Sidebar>

            <SidebarInset>
                {/* Top bar */}
                <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/60 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="h-4" />
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
                                            <BreadcrumbPage className="text-sm">{crumb.label}</BreadcrumbPage>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="ml-auto flex items-center gap-4">
                        <LiveIndicator />
                        <span className="text-xs text-muted-foreground font-mono hidden sm:block">{now}</span>
                        <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
                            <Bell className="w-3 h-3" />
                            <Badge className="h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-red-500">
                                2
                            </Badge>
                        </Button>
                    </div>
                </header>

                {/* Page content */}
                <div className="flex flex-col gap-5 p-5 overflow-auto">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}