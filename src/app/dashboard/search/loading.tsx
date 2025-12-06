import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className='h-full flex flex-col max-w-7xl mx-auto w-full'>
      {/* Fixed header section */}
      <div className="px-4 sm:px-6 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <Search className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Search Snippets</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Discover and explore public code snippets from the community
        </p>
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
        <div className="space-y-6">
          {/* Scope selector skeleton */}
          <div className="flex flex-col gap-4 sticky top-0 z-10 bg-background pb-4 pt-2 -mt-2">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-9 w-16 rounded-md" />
              <Skeleton className="h-9 w-28 rounded-md" />
              <Skeleton className="h-9 w-20 rounded-md" />
            </div>

            {/* Search and filters skeleton */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="flex-1 h-10 rounded-md" />
              <Skeleton className="w-full sm:w-[200px] h-10 rounded-md" />
            </div>
          </div>

          {/* Initial state skeleton */}
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <Skeleton className="h-6 w-48 rounded-md mb-2" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

