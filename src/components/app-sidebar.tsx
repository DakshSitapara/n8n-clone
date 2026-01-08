"use client";

import Image from "next/image";
import Link from "next/link";
import { CreditCardIcon,FolderOpenIcon, HistoryIcon, KeyIcon, LogOutIcon, Monitor, Moon, StarIcon, Sun } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscriptions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

const menuItems = [
    {
        title:"Main",
        items:[
            {
                title:"Workflows",
                icon: FolderOpenIcon,
                url:"/workflows",
            },
            {
                title:"Credentials",
                icon: KeyIcon,
                url:"/credentials",
            },
            {
                title:"Executions",
                icon: HistoryIcon,
                url:"/executions",
            }
        ],
    },
]

export const AppSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { hasActiveSubscription, isLoading } = useHasActiveSubscription();
    const {setTheme, theme, resolvedTheme } = useTheme();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        className="gap-x-4 h-10 px-4"
                    >
                        <Link href="/" prefetch>
                            <Image src="/logos/logo.svg" alt="N8N Clone" width={30} height={30} />
                            <span className="font-semibold text-sm">N8N Clone</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {menuItems.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        isActive={
                                            item.url === "/"
                                            ? pathname === "/"
                                            : pathname.startsWith(item.url)
                                        }
                                        asChild
                                        className="gap-x-4 h-10 px-4"
                                    >
                                        <Link href={item.url} prefetch>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    {!hasActiveSubscription && !isLoading && (
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className="gap-x-4 h-10 px-4"
                            tooltip={"Upgrade to Pro"}
                            onClick={() => authClient.checkout({slug: "pro"})}
                        >
                                <StarIcon className="h-4 w-4" />
                                <span>Upgrade to Pro</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    )}
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className="gap-x-4 h-10 px-4"
                            tooltip={"Billing portal"}
                            onClick={() => authClient.customer.portal()}
                        >
                                <CreditCardIcon className="h-4 w-4" />
                                <span>Billing portal</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    className="gap-x-4 h-10 px-4"
                                    tooltip={`Toggle ${theme || "system"}`}
                                >
                                    {theme === "system" ? (
                                    <Monitor className="h-4 w-4" />
                                    ) : resolvedTheme === "dark" ? (
                                    <Moon className="h-4 w-4" />
                                    ) : (
                                    <Sun className="h-4 w-4" />
                                    )}
                                    
                                    <span>
                                        Theme {theme || "system"}
                                    </span>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    <Monitor className="h-4 w-4" />
                                    <span>Light</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    <Moon className="h-4 w-4" />
                                    <span>Dark</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    <Monitor className="h-4 w-4" />
                                    <span>System</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className="gap-x-4 h-10 px-4"
                            tooltip={"Sign out"}
                            onClick={() => authClient.signOut({
                                fetchOptions: {
                                    onSuccess: () => {
                                        router.push("/login")
                                    }
                                }
                            })}
                        >
                                <LogOutIcon className="h-4 w-4" />
                                <span>Sign out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}