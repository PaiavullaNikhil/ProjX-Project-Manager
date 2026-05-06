import AIInsights from "@/components/dashboard/ai-insights";
import DashboardHero from "@/components/dashboard/dashboard-hero";
import QuickActions from "@/components/dashboard/quick-actions";
import TaskForecast from "@/components/dashboard/task-forecast";
import StatsCard from "@/components/dashboard/stat-card";
import StatisticsCharts from "@/components/dashboard/statistics-charts";
import { Loader } from "@/components/Loader";
import { UpcomingTasks } from "@/components/upcoming-tasks";
import { useGetWorkspaceStatsQuery } from "@/hooks/use-workspace";
import { useAuth } from "@/provider/auth-context";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  const { data, isPending } = useGetWorkspaceStatsQuery(workspaceId);
  
  if (!workspaceId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-primary/10 p-10 rounded-[2.5rem] border border-primary/20 glass"
        >
          <div className="size-20 text-primary mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-center">Welcome to ProjX</h2>
          <p className="text-muted-foreground text-center mt-2 font-medium">Please select a workspace from the sidebar to begin.</p>
        </motion.div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-muted-foreground mt-10">
        <p>No data available for this workspace.</p>
        <p>(Please select a WorkSpace)</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 2xl:space-y-10 pb-10 px-4 md:px-0">
      <DashboardHero user={user} stats={data.stats} />
      
      <QuickActions />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AIInsights intelligence={data.intelligence} />
        </div>
        <div className="lg:col-span-1">
          <TaskForecast tasks={data.intelligence.criticalTasks} />
        </div>
      </div>

      <StatsCard data={data.stats} />

      <StatisticsCharts
        stats={data.stats}
        taskTrendsData={data.taskTrendsData}
        projectStatusData={data.projectStatusData}
        taskPriorityData={data.taskPriorityData}
        workspaceProductivityData={data.workspaceProductivityData}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingTasks data={data.upcomingTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
