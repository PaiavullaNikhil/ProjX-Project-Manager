import { ChartBarBig, ChartLine, ChartPie, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const StatisticsCharts = ({
  stats,
  taskTrendsData,
  projectStatusData,
  taskPriorityData,
  workspaceProductivityData,
}) => {
  return (
    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-12">
      {/* Task Trends Line Chart */}
      <Card className="lg:col-span-2 glass border-primary/5 shadow-2xl rounded-[2rem] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-8 pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <CardTitle className="text-xl font-black tracking-tight">Performance Trends</CardTitle>
            </div>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Daily task status fluctuations</CardDescription>
          </div>
          <div className="p-3 bg-primary/5 rounded-2xl">
            <ChartLine className="size-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="p-8 pt-6">
          <ChartContainer
            className="h-[300px] w-full"
            config={{
              completed: { color: "#10b981" },
              inProgress: { color: "#3b82f6" },
              toDo: { color: "#6b7280" },
            }}
          >
            <LineChart data={taskTrendsData} margin={{ left: -20, right: 10 }}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <ChartTooltip />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#10b981"
                strokeWidth={4}
                dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="inProgress"
                stroke="#3b82f6"
                strokeWidth={4}
                dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="toDo"
                stroke="#6b7280"
                strokeWidth={4}
                dot={{ r: 4, fill: "#6b7280", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <ChartLegend content={<ChartLegendContent />} className="pt-8" />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Project Status Pie Chart */}
      <Card className="glass border-primary/5 shadow-2xl rounded-[2rem] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-8 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl font-black tracking-tight">Distribution</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Project lifecycle state</CardDescription>
          </div>
          <div className="p-3 bg-primary/5 rounded-2xl">
            <ChartPie className="size-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="p-8 flex flex-col items-center justify-center">
          <ChartContainer
            className="h-[250px] w-full"
            config={{
              Completed: { color: "#10b981" },
              "In Progress": { color: "#3b82f6" },
              Planning: { color: "#f59e0b" },
            }}
          >
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={8}
                stroke="none"
              >
                {projectStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity cursor-pointer" />
                ))}
              </Pie>
              <ChartTooltip />
            </PieChart>
          </ChartContainer>
          <div className="grid grid-cols-2 gap-4 w-full mt-6">
            {projectStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workspace Productivity Bar Chart */}
      <Card className="lg:col-span-3 glass border-primary/5 shadow-2xl rounded-[2rem] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-8 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl font-black tracking-tight">Resource Utilization</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Completion density per project</CardDescription>
          </div>
          <div className="p-3 bg-primary/5 rounded-2xl">
            <ChartBarBig className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="p-8 pt-6">
          <ChartContainer
            className="h-[300px] w-full"
            config={{
              completed: { color: "#3b82f6" },
              total: { color: "rgba(255,255,255,0.1)" },
            }}
          >
            <BarChart
              data={workspaceProductivityData}
              barGap={12}
              barSize={32}
              margin={{ left: -20, right: 10 }}
            >
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="total"
                fill="var(--muted)"
                radius={[8, 8, 8, 8]}
                name="Scope"
                className="opacity-20"
              />
              <Bar
                dataKey="completed"
                fill="url(#barGradient)"
                radius={[8, 8, 8, 8]}
                name="Output"
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
              <ChartLegend content={<ChartLegendContent />} className="pt-8" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCharts;