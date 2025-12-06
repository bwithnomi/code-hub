import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="px-6 py-6">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="space-y-6">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-64 w-full rounded-md" />
        <Skeleton className="h-64 w-full rounded-md" />
      </div>
    </div>
  );
}

