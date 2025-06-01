import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
import { Code, Home, Inbox, LogOut, Search, Settings } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

function AppSidebar() {
  return (
    <div className="bg-red-300 h-full">
      <Sidebar className="" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard">
                  <Code size={48} />
                  <span className="font-mono text-xl font-bold">CodeHub</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>File Mananger</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon></item.icon>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter>
          <SignOutButton>
            <Button>
              <LogOut></LogOut>
              <span>SignOut</span>
            </Button>
          </SignOutButton>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}

export default AppSidebar;
