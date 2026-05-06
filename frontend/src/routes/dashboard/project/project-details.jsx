import { useProjectQuery, useProjectActivitiesQuery } from "@/hooks/use-project";
import { useUpdateTaskStatusMutation } from "@/hooks/use-task";
import { getProjectProgress } from "@/lib";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, History, Layout, ChevronLeft, Search, Plus, Filter } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import ProjectTimeline from "@/components/project/project-timeline";
import { TaskBoardColumn } from "@/components/task/task-board-column";
import { TaskBoardCard } from "@/components/task/task-board-card";
import { ProjectSettings } from "@/components/project/project-settings";
import { Settings as SettingsIcon } from "lucide-react";

const ProjectDetails = () => {
  const { projectId, workspaceId } = useParams();
  const navigate = useNavigate();

  const [isCreateTask, setIsCreateTask] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [showActivities, setShowActivities] = useState(false);

  const { data, isLoading, isError } = useProjectQuery(projectId);
  const { data: activities, isLoading: activitiesLoading } = useProjectActivitiesQuery(projectId);
  const { mutate: updateStatus } = useUpdateTaskStatusMutation();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 2,
      },
    })
  );

  if (isLoading) return <div className="min-h-[80vh] flex items-center justify-center"><Loader /></div>;
  
  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="size-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
          <AlertCircle className="size-10" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-black tracking-tight">Loading Error</h3>
          <p className="text-muted-foreground font-medium">Could not connect to project data.</p>
        </div>
        <Button onClick={() => navigate(-1)} variant="outline" className="rounded-xl glass">
          Go Back
        </Button>
      </div>
    );
  }

  const { project, tasks = [] } = data;
  const projectProgress = getProjectProgress(tasks);

  const handleTaskClick = (taskId) => {
    navigate(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`);
  };

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t._id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (over && active.id !== over.id) {
      const taskId = active.id;
      const newStatus = over.id; 

      const task = tasks.find((t) => t._id === taskId);
      if (task && task.status !== newStatus) {
        updateStatus({ taskId, status: newStatus, projectId });
      }
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/10 p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)} 
            className="p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
          >
            <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Projects</span>
          </Button>
          
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-background border border-primary/10 flex items-center justify-center shadow-lg">
                <Layout className="size-6 text-primary" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-gradient leading-none">
                {project.title}
              </h1>
            </div>
            {project.description && (
              <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-xl">
                {project.description}
              </p>
            )}
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="glass p-4 rounded-2xl border border-primary/5 min-w-[200px] shadow-xl">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Overall Progress</span>
              <span className="text-lg font-black text-primary">{projectProgress}%</span>
            </div>
            <Progress value={projectProgress} className="h-2 shadow-inner" />
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              className={cn("size-12 rounded-xl glass border-primary/10", showActivities && "bg-primary/10 border-primary/30 ring-2 ring-primary/20")}
              onClick={() => setShowActivities(!showActivities)}
            >
              <History className="size-5" />
            </Button>
            <Button 
              onClick={() => setIsCreateTask(true)} 
              className="h-12 px-8 rounded-xl shadow-xl shadow-primary/20 bg-primary font-black uppercase tracking-widest text-[10px] gap-3 group"
            >
              <Plus className="size-4 group-hover:rotate-90 transition-transform duration-500" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-8 relative">
        <div className={cn("flex-1 transition-all duration-700", showActivities ? "md:mr-96" : "")}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <Tabs defaultValue="board" className="w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <TabsList className="glass p-1.5 rounded-2xl border border-primary/5 shadow-lg">
                  <TabsTrigger value="board" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] font-black uppercase tracking-[0.1em] px-8 h-10">Board</TabsTrigger>
                  <TabsTrigger value="timeline" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] font-black uppercase tracking-[0.1em] px-8 h-10">Timeline</TabsTrigger>
                  <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] font-black uppercase tracking-[0.1em] px-8 h-10 gap-2">
                    <SettingsIcon className="size-3" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2 p-1.5 glass rounded-2xl border border-primary/5 shadow-sm">
                  <Search className="size-4 text-muted-foreground ml-3" />
                  <input 
                    placeholder="Search tasks..." 
                    className="bg-transparent border-none focus:outline-none text-xs font-bold w-40 placeholder:text-muted-foreground/50"
                  />
                  <div className="h-6 w-px bg-primary/10 mx-2" />
                  <Button variant="ghost" size="sm" className="size-8 p-0 hover:bg-primary/5 text-muted-foreground">
                    <Filter className="size-4" />
                  </Button>
                </div>
              </div>

              <TabsContent value="board" className="m-0 focus-visible:outline-none">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {['To Do', 'In Progress', 'Done'].map((status) => (
                    <TaskBoardColumn
                      key={status}
                      id={status}
                      title={status}
                      tasks={tasks.filter((task) => task.status === status)}
                      onTaskClick={handleTaskClick}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="m-0 focus-visible:outline-none">
                <div className="glass p-8 rounded-[2rem] border border-primary/5 min-h-[500px]">
                  <ProjectTimeline tasks={tasks} />
                </div>
              </TabsContent>

              <TabsContent value="settings" className="m-0 focus-visible:outline-none">
                <ProjectSettings project={project} workspaceId={workspaceId} />
              </TabsContent>
            </Tabs>

            <DragOverlay dropAnimation={null}>
              {activeTask ? (
                <div className="w-[320px] opacity-90 scale-105 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.4),0_18px_36px_-18px_rgba(0,0,0,0.45)] pointer-events-none transition-transform">
                  <TaskBoardCard task={activeTask} isOverlay />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        <AnimatePresence>
          {showActivities && (
            <motion.aside
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="hidden md:flex flex-col w-80 fixed right-10 top-24 bottom-10 glass rounded-[2.5rem] p-8 overflow-hidden shadow-2xl border border-primary/10 z-30"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                    <History className="size-4 text-primary" />
                    Recent Activity
                  </h3>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest italic opacity-50">Project History</p>
                </div>
                <Button variant="ghost" size="icon" className="size-8 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors" onClick={() => setShowActivities(false)}>
                  <Plus className="size-4 rotate-45" />
                </Button>
              </div>
              
              <ScrollArea className="flex-1 -mr-4 pr-4 custom-scrollbar">
                <div className="space-y-6">
                  {activitiesLoading ? (
                    <div className="space-y-6">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex gap-4 animate-pulse">
                          <div className="size-10 rounded-xl bg-secondary/50 shrink-0" />
                          <div className="flex-1 space-y-2 mt-1">
                            <div className="h-3 w-3/4 bg-secondary/50 rounded" />
                            <div className="h-2 w-1/2 bg-secondary/30 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !activities || activities.length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                      <div className="size-12 bg-secondary/30 rounded-full flex items-center justify-center mx-auto opacity-20">
                        <History className="size-6" />
                      </div>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest italic">No activity logged yet.</p>
                    </div>
                  ) : (
                    activities?.map((activity, i) => (
                      <motion.div 
                        key={activity._id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex gap-4 group/activity"
                      >
                        <div className="relative">
                          <Avatar className="size-10 rounded-xl border border-primary/5 shadow-md">
                            <AvatarImage src={activity.user?.profilePicture} className="object-cover" />
                            <AvatarFallback className="text-[10px] font-black bg-primary/10 text-primary uppercase">
                              {activity.user?.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {i !== activities.length - 1 && (
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-primary/20 to-transparent" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <p className="text-[11px] font-medium leading-relaxed group-hover/activity:text-foreground transition-colors">
                            <span className="font-black text-foreground">{activity.user?.name}</span>{" "}
                            <span className="text-muted-foreground">{activity.details?.description}</span>
                          </p>
                          <p className="text-[9px] text-primary/40 font-black uppercase tracking-widest mt-1">
                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <CreateTaskDialog
        open={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId}
        projectMembers={project.members}
      />
    </div>
  );
};

export default ProjectDetails;
