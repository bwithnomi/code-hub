"use client";

import { getRecentSnippets } from "@/actions/snippets.action";
import { columns, Snippet } from "@/app/dashboard/columns";
import { DataTable } from "@/app/dashboard/data-table";
import React, { useEffect, useState, useTransition } from "react";
import { Skeleton } from "./ui/skeleton";

const DashboardTable = () => {
  const [data, setData] = useState<Snippet[]>([]);
  const [loading, startLoading] = useTransition();

  useEffect(() => {
    startLoading(async () => {
      const res = await getRecentSnippets();
      if (!res.data) {
        setData([]);
        return;
      }
      setData(res.data);
    });
  }, []);

  if (loading) {
    return <Skeleton className="h-[200] w-full"></Skeleton>;
  }
  return <DataTable columns={columns} data={data} />;
};

export default DashboardTable;
