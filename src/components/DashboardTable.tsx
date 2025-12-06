import { columns, Snippet } from "@/app/dashboard/columns";
import { DataTable } from "@/app/dashboard/data-table";
import React from "react";

interface DashboardTableProps {
  data: Snippet[];
}

const DashboardTable = ({ data }: DashboardTableProps) => {
  return <DataTable columns={columns} data={data} />;
};

export default DashboardTable;
