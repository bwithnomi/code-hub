"use client";

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
  useSidebar,
} from "./ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code, Home, Inbox, LogOut, Search, Settings, Github, Linkedin, Mail, Phone } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Snippets",
    url: "/dashboard/snippets",
    icon: Inbox,
  },
  {
    title: "Search",
    url: "/dashboard/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

function SocialLinks() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className={`flex items-center justify-center gap-2 px-2 py-2 mb-2 ${isCollapsed ? "flex-col gap-1" : "flex-row"}`}>
      <Link
        href="https://www.linkedin.com/in/bwithnomi"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="LinkedIn"
      >
        <Linkedin size={18} />
      </Link>
      <Link
        href="https://github.com/bwithnomi"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="GitHub"
      >
        <Github size={18} />
      </Link>
      <Link
        href="mailto:abidnoman888@gmail.com"
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Email"
      >
        <Mail size={18} />
      </Link>
      <Link
        href="tel:+923325671932"
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Phone"
      >
        <Phone size={18} />
      </Link>
    </div>
  );
}

function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-red-300 h-full">
      <Sidebar className="" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="hover:bg-transparent hover:text-current">
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
            <SidebarGroupLabel>Dashbaord</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(item.url));
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url}>
                          <item.icon></item.icon>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SocialLinks />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SignOutButton>
                <SidebarMenuButton tooltip="Sign Out" className="cursor-pointer w-full">
                  <LogOut />
                  <span>SignOut</span>
                </SidebarMenuButton>
              </SignOutButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}

export default AppSidebar;
