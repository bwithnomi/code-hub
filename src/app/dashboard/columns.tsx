"use client";

import { Button } from "@/components/ui/button";
import { Timestamp } from "@/lib/day";
import { ColumnDef } from "@tanstack/react-table";
import { Share } from "lucide-react";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Snippet = {
  id: number;
  title: string;
  visibility: "public" | "private" | "connections" | null;
  updatedAt: Date;
  shareId: string;
};

export const columns: ColumnDef<Snippet>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return <p className="w-40 truncate">{row.getValue("title")}</p>;
    },
  },
  {
    accessorKey: "visibility",
    header: "Shared",
  },
  {
    accessorKey: "updatedAt",
    header: "Last Modified",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      return <p className="">{Timestamp(date)}</p>;
    },
  },
  {
    accessorKey: "shareId",
    header: "Share",
    cell: ({ row }) => {
      return (
        <div className="">
          <Button>
            <Link href={`/snippet/view/${row.getValue("shareId")}`} target="blank">
              <Share />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
