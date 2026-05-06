import { useState } from "react";
import { Bell, CheckCircle2, MessageSquare, AlertTriangle, X, History, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useGetWorkspaceActivityQuery } from "@/hooks/use-workspace";
import { useSearchParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const NotificationCenter = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const workspaceId = searchParams.get("workspaceId");
  const { data: activities = [], isPending } = useGetWorkspaceActivityQuery(workspaceId);

  const getActionIcon = (type) => {
    switch (type) {
      case "completed_task": return <CheckCircle2 className="size-4" />;
      case "created_project": return <History className="size-4" />;
      case "added_comment": return <MessageSquare className="size-4" />;
      default: return <RefreshCw className="size-4" />;
    }
  };

  const getActionColor = (type) => {
    if (type.includes("completed")) return "bg-green-500/10 text-green-500";
    if (type.includes("created")) return "bg-blue-500/10 text-blue-500";
    if (type.includes("added")) return "bg-purple-500/10 text-purple-500";
    return "bg-orange-500/10 text-orange-500";
  };

  const recentActivities = activities.slice(0, 5);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group rounded-xl hover:bg-primary/5">
          <Bell className="size-5 group-hover:rotate-12 transition-transform text-muted-foreground group-hover:text-primary" />
          {activities.length > 0 && (
            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-background animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 glass border-primary/10 shadow-2xl overflow-hidden rounded-2xl">
        <DropdownMenuLabel className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-tight">Recent Activity</span>
            {activities.length > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] px-1.5 h-4 border-none">
                {activities.length} Events
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/activity?workspaceId=${workspaceId}`)}
            className="text-[10px] font-bold uppercase tracking-widest h-auto p-0 hover:bg-transparent text-primary hover:underline"
          >
            Clear All
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0 bg-primary/5" />
        <div className="max-h-[400px] overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {recentActivities.length > 0 ? (
              recentActivities.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => navigate(`/activity?workspaceId=${workspaceId}`)}
                  className="p-4 flex gap-3 border-b border-primary/5 hover:bg-primary/5 transition-colors cursor-pointer relative group"
                >
                  <div className={cn(
                    "size-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform",
                    getActionColor(item.action)
                  )}>
                    {getActionIcon(item.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-[11px] font-black truncate tracking-tight">{item.user?.name || "System"}</p>
                      <span className="text-[9px] font-bold text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 leading-tight font-medium">
                      {item.action.replace('_', ' ')} {item.details?.description || item.resourceType}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center space-y-2">
                <div className="size-10 bg-secondary/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground/20">
                  <Bell className="size-5" />
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic">No recent tactical signals</p>
              </div>
            )}
          </AnimatePresence>
        </div>
        <div className="p-3 bg-secondary/30 flex justify-center border-t border-primary/5">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/activity?workspaceId=${workspaceId}`)}
            className="w-full text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-primary/5 hover:text-primary transition-all"
          >
            Open Full Audit Trail
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCenter;
