import ThemeModeToggle from "@/components/ThemeModeToggle";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { BicepsFlexed, Brush, Code, SquareDashedBottomCode, WandSparkles, Waypoints } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-4">
      <div className="bg-slate-400 rounded-2xl px-8 py-3">
        <nav>
          <div className="flex justify-between">
            <div className="logo">
              <Link
                href="/"
                className="text-xl font-bold text-primary font-mono tracking-wider"
              >
                CodeHub
              </Link>
            </div>
            <div className="">
              {/* <ul className="flex">
                <li>
                  <Button variant="link" className="cursor-pointer">
                    <Link href="/">Home</Link>
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="cursor-pointer">
                    <Link href="/">Home</Link>
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="cursor-pointer">
                    <Link href="/">Home</Link>
                  </Button>
                </li>
              </ul> */}
            </div>
            <div className="login flex items-center justify-between gap-2">
              <ThemeModeToggle></ThemeModeToggle>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="default"
                    className="bg-transparent border-black border-2 text-black cursor-pointer hover:text-white dark:text-white dark:border-white"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button className="" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </SignedIn>
            </div>
          </div>
        </nav>

        <div className="grid grid-cols-5 mt-10 mb-6 px-4 pb-6">
          <div className="col-span-2 flex items-center">
            <div className="">
              <p className="text-white text-4xl font-bold">
                Organize your code and keep them safe, everywhere!
              </p>
              <p className="text-white my-6">
                Share and organize your snippets with ease, Lets flex through
                snippets!
              </p>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="default" className=" cursor-pointer">
                    Get Started
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
          <div className="col-span-2 col-start-4 flex justify-center">
            <Image
              src={`/ai-code-generation.svg`}
              alt="ai-code-generation.svg"
              width={250}
              height={250}
            ></Image>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-1 bg-indigo-300 p-8 rounded-2xl">
            <div className="flex gap-8">
              <p className="font-bold text-white text-4xl">Create Snippets</p>
              <SquareDashedBottomCode className="text-black" size={80} />
            </div>
          </div>
          <div className="col-span-1 bg-indigo-300 p-8 rounded-2xl">
            <div className="flex gap-8">
              <p className="font-bold text-white text-4xl">Refactor with AI</p>
              <Brush className="text-black" size={80} />
            </div>
          </div>
          <div className="col-span-1 bg-indigo-300 p-8 rounded-2xl">
            <div className="flex gap-8">
              <p className="font-bold text-white text-4xl">Generate AI Titles</p>
              <WandSparkles className="text-black" size={80} />
            </div>
          </div>
          <div className="col-span-1 bg-indigo-300 p-8 rounded-2xl">
            <div className="flex justify-center items-center gap-8">
              <p className="font-bold text-white text-4xl">Flex with code</p>
              <BicepsFlexed className="text-black" size={80} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
