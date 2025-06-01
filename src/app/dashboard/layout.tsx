import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
        <AppSidebar></AppSidebar>
        <main className="min-h-screen flex flex-col w-full">
          <div className="h-12">
            <Navbar></Navbar>
          </div>
          <div className="overflow-scroll grid-rows-11 p-4">
            {children}
          </div>
        </main>
    </SidebarProvider>
  );
}

export default layout;
