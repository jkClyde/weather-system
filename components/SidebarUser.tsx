"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    Circle,
    ChevronDown,
    LogOut,
    User,
    Loader2,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

interface SidebarUserProps {
    name: string;
    email: string;
}

export function SidebarUser({ name, email }: SidebarUserProps) {
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    // Get initials for the avatar circle
    const initials = name
        ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : email.slice(0, 2).toUpperCase();

    async function handleLogout() {
        setLoggingOut(true);
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className="gap-3">
                            {/* Avatar circle with initials */}
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sky-500/15 border border-sky-500/25 shrink-0">
                                <span className="text-[11px] font-bold text-sky-400">
                                    {initials}
                                </span>
                            </div>

                            {/* Name + email */}
                            <div className="flex flex-col gap-0.5 leading-none min-w-0 flex-1">
                                <span className="font-semibold text-sm truncate">
                                    {name || "User"}
                                </span>
                                <span className="text-[11px] text-muted-foreground truncate">
                                    {email}
                                </span>
                            </div>

                            <ChevronDown className="ml-auto size-4 text-muted-foreground shrink-0" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        side="top"
                        align="start"
                        className="w-56 mb-1"
                    >
                        {/* User info header */}
                        <DropdownMenuLabel className="flex flex-col gap-0.5 font-normal">
                            <span className="font-semibold text-sm text-foreground">
                                {name || "User"}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                                {email}
                            </span>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        {/* Profile (optional future link) */}
                        <DropdownMenuItem disabled className="gap-2 text-muted-foreground">
                            <User className="size-4" />
                            Profile
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Logout */}
                        <DropdownMenuItem
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="gap-2 text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
                        >
                            {loggingOut
                                ? <Loader2 className="size-4 animate-spin" />
                                : <LogOut className="size-4" />}
                            {loggingOut ? "Signing out…" : "Sign out"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}