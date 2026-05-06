import { BackButton } from "@/components/back-button";
import { Loader } from "@/components/Loader";
import { CommentSection } from "@/components/task/comment-section";
import { SubTasksDetails } from "@/components/task/sub-tasks";
import { TaskActivity } from "@/components/task/task-activity";
import { TaskAssigneesSelector } from "@/components/task/task-assignees-selector";
import { TaskDescription } from "@/components/task/task-description";
import { TaskPrioritySelector } from "@/components/task/task-priority-selector";
import { TaskStatusSelector } from "@/components/task/task-status-selector";
import { TaskTitle } from "@/components/task/task-title";
import { Watchers } from "@/components/task/watchers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useAchievedTaskMutation,
  useTaskByIdQuery,
  useWatchTaskMutation,
} from "@/hooks/use-task";
import { useAuth } from "@/provider/auth-context";
import { formatDistanceToNow } from "date-fns";
import { Eye, EyeOff, Calendar, Flag, Activity, Trash2, Archive, MessageSquare, ListTodo, Users, Clock, ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const TaskDetails = () => {
  const { user } = useAuth();
  const { taskId, projectId, workspaceId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useTaskByIdQuery(taskId);
  const { mutate: watchTask, isPending: isWatching } = useWatchTaskMutation();
  const { mutate: achievedTask, isPending: isAchieved } = useAchievedTaskMutation();

  if (isLoading) return <div className="min-h-[80vh] flex items-center justify-center"><Loader /></div>;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="size-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
          <Trash2 className="size-10" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-black tracking-tight">Task Not Found</h3>
          <p className="text-muted-foreground font-medium">This task could not be found on the system.</p>
        </div>
        <Button onClick={() => navigate(-1)} variant="outline" className="rounded-xl glass">
          Go Back
        </Button>
      </div>
    );
  }

  const { task, project } = data;
  const isUserWatching = task?.watchers?.some(
    (watcher) => watcher._id.toString() === user?._id.toString()
  );

  const handleWatchTask = () => {
    watchTask(
      { taskId: task._id },
      {
        onSuccess: () => toast.success("Watching status updated"),
        onError: () => toast.error("Connection error"),
      }
    );
  };

  const handleAchievedTask = () => {
    achievedTask(
      { taskId: task._id },
      {
        onSuccess: () => toast.success(task.isArchived ? "Task reactivated" : "Task archived"),
        onError: () => toast.error("An error occurred"),
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Dynamic Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)} 
            className="p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
          >
            <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back</span>
          </Button>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest px-3">
                Task
              </Badge>
              {task.isArchived && (
                <Badge variant="outline" className="text-red-500 border-red-500/20 text-[10px] font-black uppercase tracking-widest bg-red-500/5">
                  Archived
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-gradient leading-none">
              {task.title}
            </h1>
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic mt-1">
              <Clock className="size-3 text-primary" />
              Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleWatchTask}
            className={cn("h-12 px-6 rounded-xl glass border-primary/10 font-black uppercase tracking-widest text-[10px] gap-2", isUserWatching && "bg-primary/10 border-primary/30 text-primary")}
            disabled={isWatching}
          >
            {isUserWatching ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            {isUserWatching ? "Unwatch" : "Watch"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleAchievedTask}
            className="h-12 px-6 rounded-xl glass border-primary/10 font-black uppercase tracking-widest text-[10px] gap-2 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all"
            disabled={isAchieved}
          >
            <Archive className="size-4" />
            {task.isArchived ? "Unarchive" : "Archive"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Primary Mission Data */}
        <div className="lg:col-span-2 space-y-8"> 
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-[2.5rem] border border-primary/5 shadow-xl space-y-10"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Activity className="size-3 text-primary" /> Status
                </h3>
                <TaskStatusSelector status={task.status} taskId={task._id} />
              </div>
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Flag className="size-3 text-primary" /> Priority
                </h3>
                <TaskPrioritySelector priority={task.priority} taskId={task._id} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Activity className="size-3 text-primary" /> Description
              </h3>
              <TaskDescription
                description={task.description || "No description provided for this task."}
                taskId={task._id}
              />
            </div>

            <div className="pt-8 border-t border-primary/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-6">
                <Users className="size-3 text-primary" /> Assigned Members
              </h3>
              <TaskAssigneesSelector
                task={task}
                assignees={task.assignees}
                projectMembers={project.members}
              />
            </div>

            <div className="pt-8 border-t border-primary/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-6">
                <ListTodo className="size-3 text-primary" /> Subtasks
              </h3>
              <SubTasksDetails subTasks={task.subtasks || []} taskId={task._id} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-8 rounded-[2.5rem] border border-primary/5 shadow-xl"
          >
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-8">
              <MessageSquare className="size-3 text-primary" /> Comments
            </h3>
            <CommentSection taskId={task._id} members={project.members} />
          </motion.div>
        </div>

        {/* Sidebar Intel */}
        <div className="space-y-8 sticky top-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-8 rounded-[2.5rem] border border-primary/5 shadow-xl"
          >
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-6">
              <Eye className="size-3 text-primary" /> Watchers
            </h3>
            <Watchers watchers={task.watchers || []} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-8 rounded-[2.5rem] border border-primary/5 shadow-xl max-h-[600px] flex flex-col"
          >
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-6">
              <Activity className="size-3 text-primary" /> Activity Log
            </h3>
            <div className="flex-1 overflow-hidden">
               <TaskActivity resourceId={task._id} />
            </div>
          </motion.div>

          <Button 
            variant="ghost" 
            className="w-full h-14 rounded-2xl border border-red-500/10 hover:bg-red-500/10 text-red-500/50 hover:text-red-500 transition-all font-black uppercase tracking-widest text-[10px] gap-2"
          >
            <Trash2 className="size-4" />
            Delete Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
