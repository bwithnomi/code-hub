import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";
import UserSync from "@/components/UserSync";
import React, { Suspense } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
        <AppSidebar></AppSidebar>
        <main className="min-h-screen flex flex-col h-full max-h-screen w-full">
          <div className="h-12 flex-shrink-0">
            <Suspense fallback={<div className="bg-slate-200 dark:bg-slate-800 h-full w-full px-4" />}>
              <Navbar></Navbar>
            </Suspense>
          </div>
          <div className="flex-1 overflow-y-auto row-span-11 relative">
            <Suspense fallback={<div className="px-6 py-6">Loading...</div>}>
              {children}
            </Suspense>
          </div>
        </main>
        <UserSync />
    </SidebarProvider>
  );
}

export default layout;
