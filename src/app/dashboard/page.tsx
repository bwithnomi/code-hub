import { Code } from "lucide-react";
import React from "react";
import { DataTable } from "./data-table";
import { columns, Snippet } from "./columns";

async function getData(): Promise<Snippet[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      name: "React-Comp.tsx",
      shared: "private",
      size: "200kb",
      last_modified: "20-june-2025"
    },
    // ...
  ];
}

async function Dashboard() {
  const data = await getData();

  return (
    <div>
      <div className="">
        <p className="text-xl font-bold">Overview</p>
        <div className="grid grid-cols-4 mt-4">
          <div className="rounded-lg col-span-1 bg-indigo-300 p-8 flex gap-4 items-center">
            <div className="div bg-white p-4 rounded-full">
              <Code></Code>
            </div>
            <div className="">
              <p className="font-bold text-lg">Snippets</p>
              <p className="text-gray-100 text-sm">20 Files</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <p className="text-xl font-bold mb-2">Recent Snippets</p>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}

export default Dashboard;
