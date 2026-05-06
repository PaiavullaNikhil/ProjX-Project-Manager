import { motion } from "framer-motion";
import { 
  History, 
  User, 
  Folder, 
  CheckCircle2, 
  MessageSquare, 
  RefreshCw,
  Search,
  Filter,
  Layout
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import { useGetWorkspaceActivityQuery } from "@/hooks/use-workspace";
import { formatDistanceToNow } from "date-fns";
import { Loader } from "@/components/Loader";

const ActivityLog = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const { data: activities = [], isPending, isError } = useGetWorkspaceActivityQuery(workspaceId);

  const getActionIcon = (type) => {
    switch (type) {
      case "completed_task": return <CheckCircle2 className="size-6" />;
      case "created_project": return <Folder className="size-6" />;
      case "added_comment": return <MessageSquare className="size-6" />;
      default: return <RefreshCw className="size-6" />;
    }
  };

  const getActionColor = (type) => {
    if (type.includes("completed")) return "bg-green-500/10 text-green-500";
    if (type.includes("created")) return "bg-blue-500/10 text-blue-500";
    if (type.includes("added")) return "bg-purple-500/10 text-purple-500";
    return "bg-orange-500/10 text-orange-500";
  };

  if (!workspaceId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-primary/10 p-10 rounded-[2.5rem] border border-primary/20 glass text-center"
        >
          <Layout className="size-16 text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-black tracking-tight">Select a Workspace</h2>
          <p className="text-muted-foreground mt-2 font-medium max-w-xs">Activity logs are specific to each workspace. Please select one from the sidebar.</p>
        </motion.div>
      </div>
    );
  }

  if (isPending) return <div className="flex justify-center p-20"><Loader /></div>;

  if (isError) return <div className="text-center p-20 text-red-500 font-bold">Failed to load activity logs.</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl text-primary shadow-lg shadow-primary/5">
              <History className="size-5" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-gradient">Activity Log</h1>
          </div>
          <p className="text-muted-foreground font-medium">Real-time audit trail of your workspace operations.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative glass rounded-xl border-primary/10 px-3 flex items-center h-10 w-64 shadow-sm">
            <Search className="size-4 text-muted-foreground mr-2" />
            <Input 
              placeholder="Filter by user or action..." 
              className="border-none bg-transparent focus-visible:ring-0 text-xs p-0 h-full"
            />
          </div>
          <Button variant="outline" className="rounded-xl glass border-primary/10 gap-2 font-bold uppercase tracking-widest text-[10px] hover:bg-primary/5">
            <Filter className="size-3" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <motion.div
              key={activity._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass border-primary/5 hover:border-primary/20 transition-all duration-300 group overflow-hidden shadow-sm hover:shadow-md">
                <CardContent className="p-0">
                  <div className="flex items-center gap-6 p-6">
                    <div className={cn(
                      "size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                      getActionColor(activity.action)
                    )}>
                      {getActionIcon(activity.action)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-black tracking-tight">{activity.user?.name || "System"}</span>
                        <span className="text-muted-foreground text-sm font-medium">{activity.action.replace('_', ' ')}</span>
                        <span className="font-bold text-primary text-sm hover:underline cursor-pointer truncate">
                          {activity.details?.description || activity.resourceType}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </span>
                        <span className="text-[10px] text-muted-foreground">•</span>
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter h-5 px-2 bg-secondary/30 border-primary/5">
                          {activity.resourceType}
                        </Badge>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" className="hidden md:flex rounded-xl opacity-0 group-hover:opacity-100 transition-opacity uppercase text-[9px] font-bold tracking-widest hover:bg-primary/5">
                      Context
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center glass rounded-3xl border-dashed border-2 border-primary/10">
            <History className="size-10 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium italic">No activity recorded in this workspace yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
