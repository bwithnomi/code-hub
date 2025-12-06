import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const SnippetCardSkeleton = () => {
  return (
    <Card className="col-span-1 w-full min-w-0">
      <CardHeader>
        <CardTitle className="truncate">
          <Skeleton className="h-5 w-32 rounded-md" />
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Skeleton className="h-4 w-20 rounded-md" />
        </CardDescription>
        <CardAction className="gap-2 flex">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </CardFooter>
    </Card>
  );
};

export default SnippetCardSkeleton;
