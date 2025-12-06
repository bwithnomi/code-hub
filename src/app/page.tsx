import ThemeModeToggle from "@/components/ThemeModeToggle";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { BicepsFlexed, Brush, Code, Globe, SquareDashedBottomCode, WandSparkles, Waypoints } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-2 sm:p-4">
      <div className="bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 rounded-2xl px-4 sm:px-6 md:px-8 py-3">
        <nav>
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
            <div className="logo">
              <Link
                href="/"
                className="text-lg sm:text-xl font-bold text-white font-mono tracking-wider"
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
            <div className="login flex items-center justify-end sm:justify-between gap-2">
              <ThemeModeToggle></ThemeModeToggle>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-transparent border-white border-2 text-white cursor-pointer hover:bg-white/10 dark:text-white dark:border-white text-xs sm:text-sm"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button className="text-xs sm:text-sm" size="sm" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </SignedIn>
            </div>
          </div>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-5 mt-6 sm:mt-8 md:mt-10 mb-6 px-2 sm:px-4 pb-6 gap-6 md:gap-0">
          <div className="col-span-1 md:col-span-3 flex items-center">
            <div className="">
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                Your Code Snippets, Organized & Shared
              </h1>
              <p className="text-white text-base sm:text-lg md:text-xl mb-2">
                Stop losing code snippets. Save hours organizing. Share effortlessly.
              </p>
              <p className="text-white/80 text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
                Free forever. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="default" size="default" className="cursor-pointer bg-white text-black hover:bg-white/90 font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-3 shadow-lg hover:shadow-xl transition-shadow text-sm sm:text-base w-full sm:w-auto">
                      Get Started Free
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Button variant="outline" size="default" className="bg-white/10 text-white border-white hover:bg-white/20 font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto" asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                </SignedIn>
              </div>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 flex justify-center items-center">
            <Image
              src={`/ai-code-generation.svg`}
              alt="CodeHub - AI-powered code snippet manager"
              width={250}
              height={250}
              className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-[250px] lg:h-[250px]"
            />
          </div>
        </div>
      </div>
      <div className="mt-8 sm:mt-12 mb-8 px-2 sm:px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">Why CodeHub?</h2>
        <p className="text-center text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
          Tired of losing code snippets? Struggling to organize your snippets? CodeHub solves the problems developers face every day.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 p-4 sm:p-6 rounded-2xl hover:shadow-xl transition-shadow">
            <div className="flex flex-col gap-3 sm:gap-4">
              <SquareDashedBottomCode className="text-white" size={48} />
              <div>
                <h3 className="font-bold text-white text-lg sm:text-xl mb-2">Never Lose Your Code</h3>
                <p className="text-white/90 text-xs sm:text-sm">
                  Stop searching through old files. Keep all your snippets organized and easily searchable in one place.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-4 sm:p-6 rounded-2xl hover:shadow-xl transition-shadow">
            <div className="flex flex-col gap-3 sm:gap-4">
              <WandSparkles className="text-white" size={48} />
              <div>
                <h3 className="font-bold text-white text-lg sm:text-xl mb-2">Save Time on Naming</h3>
                <p className="text-white/90 text-xs sm:text-sm">
                  Stop wasting time thinking of titles. Let AI generate descriptive names so you can focus on coding.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 sm:p-6 rounded-2xl hover:shadow-xl transition-shadow">
            <div className="flex flex-col gap-3 sm:gap-4">
              <Globe className="text-white" size={48} />
              <div>
                <h3 className="font-bold text-white text-lg sm:text-xl mb-2">Share Without Hassle</h3>
                <p className="text-white/90 text-xs sm:text-sm">
                  Share code with teammates or the community. Control visibility and track engagement effortlessly.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 sm:p-6 rounded-2xl hover:shadow-xl transition-shadow">
            <div className="flex flex-col gap-3 sm:gap-4">
              <Waypoints className="text-white" size={48} />
              <div>
                <h3 className="font-bold text-white text-lg sm:text-xl mb-2">Your Data, Your Control</h3>
                <p className="text-white/90 text-xs sm:text-sm">
                  Export your snippets anytime. Never worry about vendor lock-in or losing access to your code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 sm:mt-16 mb-8 sm:mb-12 px-2 sm:px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="bg-indigo-100 dark:bg-indigo-900 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Code className="text-indigo-600 dark:text-indigo-300" size={28} />
            </div>
            <h3 className="font-bold text-lg sm:text-xl mb-2">1. Write Your Code</h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Start typing or paste your code. Add as many files as you need.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <WandSparkles className="text-purple-600 dark:text-purple-300" size={28} />
            </div>
            <h3 className="font-bold text-lg sm:text-xl mb-2">2. AI Suggests a Title</h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Get an instant title suggestion, or write your own. Then save.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Globe className="text-blue-600 dark:text-blue-300" size={28} />
            </div>
            <h3 className="font-bold text-lg sm:text-xl mb-2">3. Share or Keep Private</h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Choose who can see it, or keep it to yourself. Access it anytime.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-12 sm:mt-16 mb-8 sm:mb-12 text-center px-2 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Trusted by Developers</h2>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 sm:px-4 py-2 flex items-center gap-2">
              <Code className="text-blue-500" size={18} />
              <span className="font-medium text-sm sm:text-base">Next.js</span>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 sm:px-4 py-2 flex items-center gap-2">
              <Code className="text-blue-600" size={18} />
              <span className="font-medium text-sm sm:text-base">TypeScript</span>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 sm:px-4 py-2 flex items-center gap-2">
              <Code className="text-green-600" size={18} />
              <span className="font-medium text-sm sm:text-base">Drizzle ORM</span>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 sm:px-4 py-2 flex items-center gap-2">
              <Code className="text-purple-600" size={18} />
              <span className="font-medium text-sm sm:text-base">Tailwind CSS</span>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 sm:px-4 py-2 flex items-center gap-2">
              <Code className="text-orange-500" size={18} />
              <span className="font-medium text-sm sm:text-base">Monaco Editor</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-muted-foreground text-sm sm:text-base">Languages Supported</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">∞</div>
              <div className="text-muted-foreground text-sm sm:text-base">Files Per Snippet</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">0</div>
              <div className="text-muted-foreground text-sm sm:text-base">Cost to Start</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 sm:mt-16 mb-8 sm:mb-12 bg-slate-100 dark:bg-slate-800 rounded-3xl p-6 sm:p-8 md:p-12 mx-2 sm:mx-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Everything You Need</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-indigo-500 rounded-lg p-2 flex-shrink-0">
              <Code className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-1">Monaco Editor</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                VS Code's editor engine with syntax highlighting for 100+ languages, IntelliSense, and code formatting
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-orange-500 rounded-lg p-2 flex-shrink-0">
              <SquareDashedBottomCode className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-1">Multi-File Architecture</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Support for unlimited files per snippet with independent language detection and syntax highlighting
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-pink-500 rounded-lg p-2 flex-shrink-0">
              <Brush className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-1">Customizable Settings</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Adjustable font size (10-24px), editor themes (light/dark/custom), and default language preferences
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-green-500 rounded-lg p-2 flex-shrink-0">
              <Waypoints className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-1">Export Formats</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Export as JSON (structured data) or ZIP (file-based archive) for backup and migration
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-blue-500 rounded-lg p-2 flex-shrink-0">
              <Globe className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-1">Visibility Controls</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Three privacy levels: public (shareable link), private (you only), or connections (selected users)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-purple-500 rounded-lg p-2 flex-shrink-0">
              <WandSparkles className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-1">View Analytics</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Track view counts on shared snippets to measure engagement and popularity
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 sm:mt-16 mb-8 sm:mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-6 sm:p-8 md:p-12 text-white mx-2 sm:mx-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Organize Your Code?</h2>
        <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90">Join thousands of developers who have already streamlined their workflow with CodeHub.</p>
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="secondary" size="default" className="bg-white text-blue-600 hover:bg-white/90 font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-3 shadow-lg hover:shadow-xl transition-shadow text-sm sm:text-base w-full sm:w-auto">
              Start Organizing Free
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Button variant="secondary" size="default" className="bg-white text-blue-600 hover:bg-white/90 font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-3 shadow-lg hover:shadow-xl transition-shadow text-sm sm:text-base w-full sm:w-auto" asChild>
            <Link href="/dashboard">Create Your First Snippet</Link>
          </Button>
        </SignedIn>
      </div>
    </div>
  );
}
