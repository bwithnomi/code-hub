import DashboardTable from "@/components/DashboardTable";
import DashboardOverview from "@/components/DashboardOverview";

async function Dashboard() {
  return (
    <div className="px-6 py-6 ">
      <div className="">
        <p className="text-xl font-bold">Overview</p>
        <DashboardOverview/>
      </div>
      <div className="mt-8">
        <p className="text-xl font-bold mb-2">Recent Snippets</p>
        <DashboardTable></DashboardTable>
      </div>
    </div>
  );
}

export default Dashboard;
