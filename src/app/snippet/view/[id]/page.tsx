export const dynamic = 'force-dynamic'; // ✅ disables route caching
export const revalidate = 0; // ✅ prevents any caching

import { viewSnippetByShareId } from "@/actions/snippets.action";
import { Code, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Suspense } from "react";
import SnippetViewer from "./SnippetViewer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function SnippetContent({ shareId }: { shareId: string }) {
  const snippet = await viewSnippetByShareId(shareId);
  
  if (!snippet) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <Card className="border-2 shadow-2xl bg-gradient-to-br from-card to-muted/30 overflow-hidden">
          <div className="relative p-6 sm:p-8 md:p-12">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }}></div>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center gap-6 sm:gap-8 text-center">
              <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-destructive/10 border-2 border-destructive/20">
                <Lock size={48} className="sm:w-16 sm:h-16 text-destructive" />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold">Snippet Not Found</h2>
                <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto px-4">
                  This snippet either doesn't exist or hasn't been shared publicly.
                </p>
              </div>
              <div className="pt-2 sm:pt-4">
                <Image 
                  src="/private_snippet.svg" 
                  width={200} 
                  height={200} 
                  alt="Private snippet"
                  className="mx-auto opacity-80 sm:w-[250px] sm:h-[250px]"
                />
              </div>
              <Button asChild size="lg" className="mt-2 sm:mt-4 shadow-lg w-full sm:w-auto">
                <Link href="/">Go to Home</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <SnippetViewer
      title={snippet.snippet.title}
      files={snippet.snippet.files}
      viewsCount={snippet.views}
      visibility={snippet.snippet.visibility || "private"}
      updatedAt={snippet.snippet.updatedAt}
    />
  );
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="mb-6 sm:mb-8 md:mb-10 flex items-center justify-center">
        <Link href="/" className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Code size={20} className="sm:w-7 sm:h-7 text-primary" />
          </div>
          <span className="font-mono text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            CodeHub
          </span>
        </Link>
      </div>
      <Suspense
        key={id}
        fallback={
          <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8">
            <Card className="border-2 shadow-xl animate-pulse bg-gradient-to-br from-primary/10 via-primary/5 to-background">
              <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                <div className="h-3 sm:h-4 bg-primary/20 rounded w-20 sm:w-24"></div>
                <div className="h-8 sm:h-10 bg-primary/20 rounded w-full sm:w-3/4"></div>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <div className="h-10 sm:h-12 bg-primary/20 rounded-lg w-full sm:w-32"></div>
                  <div className="h-10 sm:h-12 bg-primary/20 rounded-lg w-full sm:w-32"></div>
                  <div className="h-10 sm:h-12 bg-primary/20 rounded-lg w-full sm:w-32"></div>
                </div>
              </div>
            </Card>
            <Card className="border-2 shadow-xl animate-pulse">
              <div className="p-4 sm:p-6 bg-gradient-to-r from-primary/5 to-transparent border-b-2">
                <div className="h-5 sm:h-6 bg-primary/20 rounded w-1/2 sm:w-1/3 mb-3 sm:mb-4"></div>
              </div>
              <div className="h-64 sm:h-80 md:h-96 bg-muted/50"></div>
            </Card>
          </div>
        }
      >
        <SnippetContent shareId={id} />
      </Suspense>
    </div>
  );
};

export default page;
