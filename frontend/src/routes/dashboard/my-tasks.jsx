import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { Loader } from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetMyTasksQuery } from "@/hooks/use-task";
import { format } from "date-fns";
import { ArrowUpRight, CheckCircle2, Clock, Filter, Search, List, Kanban, ArrowUpDown, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

const MyTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const workspaceId = searchParams.get("workspaceId");
  const initialFilter = searchParams.get("filter") || "all";
  const initialSort = searchParams.get("sort") || "desc";
  const initialSearch = searchParams.get("search") || "";

  const [filter, setFilter] = useState(initialFilter);
  const [sortDirection, setSortDirection] = useState(initialSort === "asc" ? "asc" : "desc");
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    const params = {};
    searchParams.forEach((value, key) => {
      if (value) params[key] = value;
    });

    if (search) params.search = search;
    if (filter) params.filter = filter;
    if (sortDirection) params.sort = sortDirection;

    setSearchParams(params, { replace: true });
  }, [filter, sortDirection, search]);

  useEffect(() => {
    const urlFilter = searchParams.get("filter") || "all";
    const urlSort = searchParams.get("sort") || "desc";
    const urlSearch = searchParams.get("search") || "";

    if (urlFilter !== filter) setFilter(urlFilter);
    if (urlSort !== sortDirection) setSortDirection(urlSort === "asc" ? "asc" : "desc");
    if (urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

  const { data: myTasks, isLoading } = useGetMyTasksQuery(workspaceId, {
    enabled: !!workspaceId,
  }) || {};

  if (!workspaceId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-primary/10 p-10 rounded-[2.5rem] border border-primary/20 glass text-center"
        >
          <Layout className="size-16 text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-black tracking-tight text-gradient">Select a Workspace</h2>
          <p className="text-muted-foreground mt-2 font-medium max-w-xs">Please select a workspace to view your assigned objectives.</p>
        </motion.div>
      </div>
    );
  }

  if (isLoading) return <div className="flex justify-center p-20"><Loader /></div>;

  const filteredTasks = myTasks?.length
    ? myTasks
        .filter((task) => {
          if (filter === "all") return true;
          if (filter === "todo") return task.status === "To Do";
          if (filter === "inprogress") return task.status === "In Progress";
          if (filter === "done") return task.status === "Done";
          if (filter === "achieved") return task.isArchived === true;
          if (filter === "high") return task.priority === "High";
          return true;
        })
        .filter(
          (task) =>
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.description?.toLowerCase().includes(search.toLowerCase())
        )
    : [];

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      return sortDirection === "asc"
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : new Date(b.dueDate) - new Date(a.dueDate);
    }
    return 0;
  });

  const todoTasks = sortedTasks.filter((task) => task.status === "To Do");
  const inProgressTasks = sortedTasks.filter((task) => task.status === "In Progress");
  const doneTasks = sortedTasks.filter((task) => task.status === "Done");

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary shadow-lg shadow-primary/5">
              <CheckCircle2 className="size-5" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-gradient">My Objectives</h1>
          </div>
          <p className="text-muted-foreground font-medium">Track and manage your personal contributions across all projects.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative glass rounded-2xl border-primary/10 px-4 flex items-center h-12 w-full md:w-64 shadow-sm group">
            <Search className="size-4 text-muted-foreground mr-3 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search objectives..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-none bg-transparent focus-visible:ring-0 text-sm p-0 h-full placeholder:font-medium"
            />
          </div>

          <Button
            variant="outline"
            className="rounded-2xl glass border-primary/10 h-12 w-12 p-0 hover:bg-primary/5"
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className="size-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-2xl glass border-primary/10 h-12 gap-2 font-black uppercase tracking-widest text-[10px] hover:bg-primary/5">
                <Filter className="size-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl glass border-primary/10 p-2 shadow-2xl">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest px-3 py-2 text-muted-foreground">Category</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-primary/5" />
              {[
                ["all", "All Tasks"],
                ["todo", "To Do"],
                ["inprogress", "In Progress"],
                ["done", "Done"],
                ["achieved", "Archived"],
                ["high", "Critical Priority"],
              ].map(([key, label]) => (
                <DropdownMenuItem 
                  key={key} 
                  onClick={() => setFilter(key)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider mb-1 cursor-pointer transition-colors",
                    filter === key ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
                  )}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <div className="flex items-center justify-between mb-8 border-b border-primary/5 pb-4">
          <TabsList className="bg-secondary/30 p-1 rounded-2xl border border-primary/5 h-12">
            <TabsTrigger value="list" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl gap-2 text-xs font-black uppercase tracking-widest h-full transition-all">
              <List className="size-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="board" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl gap-2 text-xs font-black uppercase tracking-widest h-full transition-all">
              <Kanban className="size-4" />
              Board
            </TabsTrigger>
          </TabsList>
          
          <Badge variant="outline" className="rounded-xl glass border-primary/20 text-primary font-black px-4 py-1">
            {sortedTasks.length} Total
          </Badge>
        </div>

        <TabsContent value="list" className="mt-0">
          <Card className="glass border-primary/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-primary/5">
                {sortedTasks.length === 0 ? (
                  <div className="p-20 text-center space-y-4">
                    <div className="size-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
                      <Clock className="size-8" />
                    </div>
                    <p className="text-muted-foreground font-medium italic">No objectives match your current filters.</p>
                  </div>
                ) : (
                  sortedTasks.map((task, index) => (
                    <motion.div 
                      key={task._id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="group p-6 hover:bg-primary/5 transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "size-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg mt-1 group-hover:scale-110 transition-transform",
                            task.status === "Done" ? "bg-emerald-500/10 text-emerald-500" : 
                            task.status === "In Progress" ? "bg-blue-500/10 text-blue-500" : "bg-slate-500/10 text-slate-500"
                          )}>
                            {task.status === "Done" ? <CheckCircle2 className="size-5" /> : <Clock className="size-5" />}
                          </div>

                          <div className="space-y-2">
                            <Link
                              to={`/workspaces/${task.project?.workspace}/projects/${task.project?._id}/tasks/${task._id}`}
                              className="text-lg font-black tracking-tight group-hover:text-primary transition-colors flex items-center gap-2"
                            >
                              {task.title}
                              <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </Link>

                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className={cn(
                                "text-[10px] font-black uppercase tracking-widest h-6 px-3 rounded-full border-primary/5",
                                task.status === "Done" ? "bg-emerald-500/5 text-emerald-600" : "bg-secondary/50"
                              )}>
                                {task.status}
                              </Badge>
                              {task.priority && (
                                <Badge
                                  className={cn(
                                    "text-[10px] font-black uppercase tracking-widest h-6 px-3 rounded-full border-none",
                                    task.priority === "High" ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-secondary/50 text-muted-foreground"
                                  )}
                                >
                                  {task.priority} Priority
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest h-6 px-3 rounded-full bg-secondary/20 border-primary/5">
                                {task.project?.title}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:items-end gap-2 shrink-0">
                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                            {task.dueDate ? `Deadline: ${format(new Date(task.dueDate), "PPP")}` : "No deadline set"}
                          </div>
                          <div className="text-[10px] font-bold text-muted-foreground italic">
                            Last tactical update: {format(new Date(task.updatedAt), "PPP")}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="board" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[["Strategic Queue", todoTasks, "bg-slate-500"], ["Active Deployment", inProgressTasks, "bg-blue-500"], ["Mission Complete", doneTasks, "bg-emerald-500"]].map(
              ([column, tasks, color], colIndex) => (
                <div key={column} className="space-y-6">
                  <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("size-2.5 rounded-full shadow-lg shadow-current", color.replace('bg-', 'text-'))} />
                      <h3 className="text-sm font-black uppercase tracking-[0.2em]">{column}</h3>
                    </div>
                    <Badge variant="secondary" className="rounded-lg bg-secondary/50 text-muted-foreground font-black text-[10px]">
                      {tasks.length}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {tasks.length === 0 ? (
                      <div className="p-10 text-center glass rounded-3xl border-dashed border border-primary/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Empty Sector</p>
                      </div>
                    ) : (
                      tasks.map((task, taskIndex) => (
                        <motion.div
                          key={task._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (colIndex * 0.1) + (taskIndex * 0.05) }}
                        >
                          <Card className="glass border-primary/5 hover:border-primary/20 transition-all duration-300 group rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl cursor-pointer">
                            <CardContent className="p-6 space-y-4">
                              <Link
                                to={`/workspaces/${task.project?.workspace}/projects/${task.project?._id}/tasks/${task._id}`}
                                className="block space-y-2"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <h4 className="font-black tracking-tight leading-tight group-hover:text-primary transition-colors">{task.title}</h4>
                                  <Badge className={cn(
                                    "text-[8px] font-black uppercase tracking-tighter shrink-0 h-4 px-1.5",
                                    task.priority === "High" ? "bg-red-500" : "bg-secondary text-muted-foreground"
                                  )}>
                                    {task.priority === "High" ? "!" : ""}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                                  {task.description || "No mission description provided."}
                                </p>
                              </Link>
                              
                              <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                                <div className="flex items-center gap-2">
                                  <Clock className="size-3 text-muted-foreground" />
                                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                    {task.dueDate ? format(new Date(task.dueDate), "MMM d") : "No Due"}
                                  </span>
                                </div>
                                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter bg-primary/5 border-primary/10">
                                  {task.project?.title}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTasks;
