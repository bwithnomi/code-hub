"use client";

import { getMySnippetCount, getViewsCount } from "@/actions/snippets.action";
import { Code, Eye } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
import { Skeleton } from "./ui/skeleton";

const DashboardOverview = () => {
  const [loading, startLoading] = useTransition();
  const [count, setCount] = useState<string>("0");
  const [views, setViews] = useState<string>("0");
  useEffect(() => {
    startLoading(async () => {
      const [snippetCount, viewsCount] = await Promise.all([
        getMySnippetCount(),
        getViewsCount(),
      ]);
      setCount((await snippetCount.data?.count!).toString() || "");
      setViews((await viewsCount.data?.count!).toString() || "");
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-4 mt-4 gap-4">
        <Skeleton className="w-full h-[120]"></Skeleton>
        <Skeleton className="w-full h-[120]"></Skeleton>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-4 mt-4 gap-4">
      <div className="rounded-lg col-span-1 bg-indigo-300 p-8 dark:bg-indigo-300 flex gap-4 items-center">
        <div className="div bg-white text-black dark:text-black p-4 rounded-full">
          <Code></Code>
        </div>
        <div className="">
          <p className="font-bold text-xl">Snippets</p>
          <p className="text-gray-100 text-md font-bold">
            {parseInt(count)} {parseInt(count) > 1 ? "Files" : "File"}
          </p>
        </div>
      </div>
      <div className="rounded-lg col-span-1 bg-indigo-300 dark:bg-indigo-300  p-8 flex gap-4 items-center">
        <div className="div bg-white p-4 rounded-full text-black dark:text-black">
          <Eye></Eye>
        </div>
        <div className="">
          <p className="font-bold text-xl">Views</p>
          <p className="text-gray-100 text-md font-bold">
            {parseInt(views)} {parseInt(views) > 1 ? "Views" : "View"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
