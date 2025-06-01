"use client"

import { useTheme } from "next-themes";
import React from "react";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

function ThemeModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="bg-transparent border-black border-2 cursor-pointer hover:bg-transparent"
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"></SunIcon>
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default ThemeModeToggle;
