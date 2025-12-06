import DashboardTable from "@/components/DashboardTable";
import DashboardOverview from "@/components/DashboardOverview";
import { getMySnippetCount, getViewsCount, getRecentSnippets } from "@/actions/snippets.action";

async function Dashboard() {
  // Fetch all data in parallel on the server
  const [snippetCountResult, viewsCountResult, recentSnippetsResult] = await Promise.all([
    getMySnippetCount(),
    getViewsCount(),
    getRecentSnippets(),
  ]);

  return (
    <div className="px-6 py-6 ">
      <div className="">
        <p className="text-xl font-bold">Overview</p>
        <DashboardOverview
          snippetCount={snippetCountResult.data?.count || 0}
          viewsCount={viewsCountResult.data?.count || 0}
          maxSnippets={snippetCountResult.data?.maxSnippets || Infinity}
        />
      </div>
      <div className="mt-8">
        <p className="text-xl font-bold mb-2">Recent Snippets</p>
        <DashboardTable data={recentSnippetsResult.data || []} />
      </div>
    </div>
  );
}

export default Dashboard;
