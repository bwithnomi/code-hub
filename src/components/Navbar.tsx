import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { Input } from "./ui/input";
import { currentUser } from "@clerk/nextjs/server";
import ThemeModeToggle from "./ThemeModeToggle";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import { syncUser } from "@/actions/user.action";

async function Navbar() {
  const user = await currentUser();
  if (user) await syncUser();
  
  return (
    <div className="bg-slate-200  h-full w-full dark:bg-slate-800 px-4">
      <div className="flex justify-between items-center h-full py-2">
        <SidebarTrigger />
        <div className=" py-2 w-80">
          <Input type="search" placeholder="Search" className="bg-slate-100" />
        </div>
        <div className="">
          <div className="flex items-center justify-between gap-2">
            <ThemeModeToggle></ThemeModeToggle>
            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link
                href={`dashboard/profile/`}
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden lg:inline">Profile</span>
              </Link>
            </Button>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
