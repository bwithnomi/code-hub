import { Code, Eye } from "lucide-react";
import React from "react";

interface DashboardOverviewProps {
  snippetCount: number;
  viewsCount: number;
  maxSnippets: number;
}

const DashboardOverview = ({ snippetCount, viewsCount, maxSnippets }: DashboardOverviewProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4 gap-4">
      <div className="rounded-lg bg-indigo-300 p-6 sm:p-8 dark:bg-indigo-300 flex gap-4 items-center">
        <div className="bg-white text-black dark:text-black p-4 rounded-full flex-shrink-0">
          <Code className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-lg sm:text-xl">Snippets</p>
          <p className="text-gray-100 text-sm sm:text-md font-bold">
            {snippetCount} {snippetCount !== 1 ? "Files" : "File"}
            {maxSnippets !== Infinity && (
              <span className="text-gray-200"> / {maxSnippets}</span>
            )}
          </p>
        </div>
      </div>
      <div className="rounded-lg bg-indigo-300 dark:bg-indigo-300 p-6 sm:p-8 flex gap-4 items-center">
        <div className="bg-white p-4 rounded-full text-black dark:text-black flex-shrink-0">
          <Eye className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-lg sm:text-xl">Views</p>
          <p className="text-gray-100 text-sm sm:text-md font-bold">
            {viewsCount} {viewsCount !== 1 ? "Views" : "View"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
