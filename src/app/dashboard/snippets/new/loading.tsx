import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col overflow-hidden h-full w-full px-3 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="w-full sm:w-80">
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
        <div className="flex flex-wrap justify-end items-center gap-2">
          <Skeleton className="h-10 w-full sm:w-[200px] rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </div>
      <div className="flex-1 overflow-scroll mt-4">
        <div className="mt-4 px-2 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Skeleton className="h-10 w-full sm:w-[280px] rounded-md" />
          </div>
          <div className="mt-4">
            <Skeleton className="w-full h-[300px] rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

