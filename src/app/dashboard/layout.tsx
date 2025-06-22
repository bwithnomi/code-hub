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
        <main className="min-h-screen flex flex-col h-full overflow-hidden max-h-screen w-full">
          <div className="h-12">
            <Navbar></Navbar>
          </div>
          <div className="overflow-hidden row-span-11 grow-1 h-full relative">
            {children}
          </div>
        </main>
    </SidebarProvider>
  );
}

export default layout;
