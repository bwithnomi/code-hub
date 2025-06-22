"use client";

import { getSnippetCount } from "@/actions/snippets.action";
import { Code } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
import { Skeleton } from "./ui/skeleton";

const DashboardOverview = () => {
  const [loading, startLoading] = useTransition();
  const [count, setCount] = useState<string>("0");
  useEffect(() => {
    startLoading(async () => {
      const snippetCount = await getSnippetCount();
      setCount((await snippetCount.data?.count!).toString() || "");
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-4 mt-4">
        <Skeleton className="w-full h-[120]"></Skeleton>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-4 mt-4">
      <div className="rounded-lg col-span-1 bg-indigo-300 p-8 flex gap-4 items-center">
        <div className="div bg-white p-4 rounded-full">
          <Code></Code>
        </div>
        <div className="">
          <p className="font-bold text-lg">Snippets</p>
          <p className="text-gray-100 text-sm">
            {parseInt(count)} {parseInt(count) > 1 ? "Files" : "File"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
