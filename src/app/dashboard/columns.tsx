"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { Share } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Snippet = {
  id: string
  name: string
  shared: "public" | "private" | "team"
  size: string
  last_modified: string
}

export const columns: ColumnDef<Snippet>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "shared",
    header: "Shared",
  },
  {
    accessorKey: "last_modified",
    header: "Last Modified",
  },
  {
    accessorKey: "share",
    header: "Share",
    cell: ({row}) => {
        return (
            <div className="">
                <Button>
                    <Share/>
                </Button>
            </div>
        )
    }
  },
]