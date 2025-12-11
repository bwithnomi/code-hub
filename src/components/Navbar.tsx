"use client";

import React, { useState, useEffect } from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { Input } from "./ui/input";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/lib/debounce";
import { useRouter } from "next/navigation";

function Navbar() {
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const router = useRouter();

  useEffect(() => {
    if (debouncedSearch.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(debouncedSearch.trim())}`);
    }
  }, [debouncedSearch, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="bg-slate-200  h-full w-full dark:bg-slate-800 px-4">
      <div className="flex justify-between items-center h-full py-2">
        <SidebarTrigger />
        <div className="py-2 sm:w-80 w-60 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search"
            className="bg-slate-100 pl-10 pr-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
