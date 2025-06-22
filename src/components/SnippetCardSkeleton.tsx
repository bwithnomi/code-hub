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
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="w-40 truncate">
          <Skeleton className="w-full h-[16] rounded-full" />
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Skeleton className="w-[50] h-[16] rounded-full" />
        </CardDescription>
        <CardAction className="gap-2 flex">
          <Skeleton className="w-[40] h-[36] rounded-2xl" />
          <Skeleton className="w-[40] h-[36] rounded-2xl" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full h-[24] rounded-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="w-full h-[16] rounded-2xl" />
      </CardFooter>
    </Card>
  );
};

export default SnippetCardSkeleton;
