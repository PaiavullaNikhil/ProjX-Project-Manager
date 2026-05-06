import { useState } from "react";
import { NoDataFound } from "../no-data-found";
import { ProjectCard } from "../project/projetc-card";
import { Button } from "../ui/button";
import { LayoutGrid, List, ArrowRight, Calendar, Users, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "../ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, ExternalLink } from "lucide-react";
import { useDeleteProjectMutation } from "@/hooks/use-project";
import { toast } from "sonner";

export const ProjectList = ({ workspaceId, projects, onCreateProject }) => {
  const [view, setView] = useState("list"); // Default to list as requested

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-3xl font-black tracking-tighter text-gradient">Projects</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">View and manage your projects</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-secondary/30 p-1 rounded-xl border border-primary/5 flex items-center h-10 shadow-inner">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setView("grid")}
              className={cn(
                "rounded-lg px-4 h-full transition-all",
                view === "grid" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-primary/5"
              )}
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setView("list")}
              className={cn(
                "rounded-lg px-4 h-full transition-all",
                view === "list" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-primary/5"
              )}
            >
              <List className="size-4" />
            </Button>
          </div>
          
          <div className="hidden sm:flex text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary px-4 py-2 rounded-xl border border-primary/10">
            {projects.length} Total
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {projects.length === 0 ? (
          <motion.div
            key="no-data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <NoDataFound
              title="No projects found"
              description="You haven't created any projects yet. Create one to get started."
              buttonText="Create Project"
              buttonAction={onCreateProject}
            />
          </motion.div>
        ) : view === "grid" ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                progress={0}
                workspaceId={workspaceId}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {projects.map((project, index) => (
              <ProjectListItem 
                key={project._id} 
                project={project} 
                workspaceId={workspaceId} 
                index={index}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProjectActions = ({ project, workspaceId }) => {
  const navigate = useNavigate();
  const { mutate: deleteProject } = useDeleteProjectMutation();

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
      deleteProject({ projectId: project._id }, {
        onSuccess: () => toast.success("Project deleted"),
        onError: () => toast.error("Failed to delete project")
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 rounded-lg hover:bg-primary/10 text-muted-foreground transition-all shrink-0">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass border-primary/10 rounded-xl min-w-[160px] p-2 shadow-2xl">
        <DropdownMenuItem 
          onClick={() => navigate(`/workspaces/${workspaceId}/projects/${project._id}`)}
          className="rounded-lg focus:bg-primary/10 font-bold gap-3 py-2.5"
        >
          <ExternalLink className="size-4 text-primary" />
          Open Project
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate(`/workspaces/${workspaceId}/projects/${project._id}?tab=settings`)}
          className="rounded-lg focus:bg-primary/10 font-bold gap-3 py-2.5"
        >
          <Edit className="size-4 text-blue-500" />
          Edit Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-primary/5 my-1" />
        <DropdownMenuItem 
          onClick={handleDelete}
          className="rounded-lg focus:bg-red-500/10 text-red-500 font-bold gap-3 py-2.5"
        >
          <Trash2 className="size-4" />
          Delete Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ProjectListItem = ({ project, workspaceId, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onContextMenu={(e) => {
        // Trigger the dropdown menu via right click
        e.preventDefault();
        const trigger = e.currentTarget.querySelector('[aria-haspopup="menu"]');
        trigger?.click();
      }}
      className="group relative"
    >
      <Link to={`/workspaces/${workspaceId}/projects/${project._id}`} className="block">
        <div className="glass p-6 rounded-[1.5rem] border border-primary/5 hover:border-primary/20 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:bg-primary/5 group/item">
          <div className="flex items-center gap-5">
            <div className="size-12 rounded-xl bg-background border border-primary/5 flex items-center justify-center shadow-lg group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-500">
              <Layers className="size-5 text-primary" />
            </div>
            <div>
              <h4 className="text-xl font-black tracking-tight group-hover/item:text-primary transition-colors leading-none mb-1.5">{project.title}</h4>
              <div className="flex items-center gap-3">
                <StatusBadge status={project.status} />
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
                  <Users className="size-3" />
                  {project.members?.length || 0} Members
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8 md:gap-12 pr-12">
            {project.dueDate && (
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Due Date</span>
                <div className="flex items-center gap-2">
                  <Calendar className="size-3.5 text-primary" />
                  <span className="text-xs font-black">{format(new Date(project.dueDate), "MMM d, yyyy")}</span>
                </div>
              </div>
            )}
            
            <div className="flex flex-col min-w-[120px]">
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Progress</span>
                <span className="text-[10px] font-black text-primary">
                  {(() => {
                    const total = project.tasks?.length || 0;
                    const completed = project.tasks?.filter(t => t.status === "Done").length || 0;
                    return total > 0 ? Math.round((completed / total) * 100) : 0;
                  })()}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden border border-primary/5">
                <div 
                  className="h-full bg-primary/20 rounded-full" 
                  style={{ 
                    width: `${(() => {
                      const total = project.tasks?.length || 0;
                      const completed = project.tasks?.filter(t => t.status === "Done").length || 0;
                      return total > 0 ? Math.round((completed / total) * 100) : 0;
                    })()}%` 
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Absolute positioned actions to keep them outside the link flow but inside the relative container */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <ProjectActions project={project} workspaceId={workspaceId} />
      </div>
    </motion.div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    "Completed": "bg-emerald-500/10 text-emerald-500 border-emerald-500/10",
    "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/10",
    "Planning": "bg-orange-500/10 text-orange-500 border-orange-500/10",
    "On Hold": "bg-amber-500/10 text-amber-500 border-amber-500/10",
    "Cancelled": "bg-red-500/10 text-red-500 border-red-500/10"
  };

  return (
    <span className={cn(
      "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border",
      styles[status] || styles["Planning"]
    )}>
      {status}
    </span>
  );
};
