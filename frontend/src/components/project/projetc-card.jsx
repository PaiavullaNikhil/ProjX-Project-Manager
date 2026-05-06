import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarDays, ArrowRight, Layers, CheckCircle2, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { motion } from "framer-motion";

export const ProjectCard = ({ project, progress = 0, workspaceId }) => {
  const isCompleted = project.status === "Completed";
  const isInProgress = project.status === "In Progress";
  
  return (
    <Link to={`/workspaces/${workspaceId}/projects/${project._id}`} className="block group">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="relative overflow-hidden transition-all duration-700 border-primary/5 glass hover:border-primary/20 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] rounded-[2rem]">
          {/* Visual Accents */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-primary/15 transition-all duration-700" />
          
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="size-12 rounded-[1.25rem] bg-background border border-primary/5 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Layers className="size-5 text-primary" />
              </div>
              <Badge status={project.status} />
            </div>
            
            <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors leading-none mb-3">
              {project.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity min-h-[40px]">
              {project.description || "No description provided for this project."}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 pt-4">
            <div className="space-y-8">
              {/* Progress System */}
              <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Project Progress</span>
                    <span className="text-xl font-black tracking-tighter">{progress}% Complete</span>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="size-6 rounded-full border-2 border-background bg-secondary/50" />
                    ))}
                  </div>
                </div>
                <div className="relative h-2.5 w-full bg-secondary/30 rounded-full overflow-hidden border border-primary/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className={cn(
                      "h-full rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]",
                      isCompleted ? "bg-emerald-500" : "bg-gradient-to-r from-primary to-blue-500"
                    )}
                  />
                </div>
              </div>

              {/* Tactical Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Tasks</span>
                    <span className="text-sm font-black text-primary">{project.tasks?.length || 0}</span>
                  </div>
                  {project.dueDate && (
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Due Date</span>
                      <span className="text-sm font-black text-foreground/80">{format(new Date(project.dueDate), "MMM d")}</span>
                    </div>
                  )}
                </div>

                <div className="size-10 rounded-full bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                  <ArrowRight className="size-4 text-primary" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

const Badge = ({ status }) => {
  const styles = {
    "Completed": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Planning": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    "On Hold": "bg-amber-500/10 text-amber-500 border-amber-500/20",
    "Cancelled": "bg-red-500/10 text-red-500 border-red-500/20"
  };

  return (
    <span className={cn(
      "text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border shadow-sm",
      styles[status] || styles["Planning"]
    )}>
      {status}
    </span>
  );
};
