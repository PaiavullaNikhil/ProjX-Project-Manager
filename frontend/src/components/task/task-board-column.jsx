import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { TaskBoardCard } from "./task-board-card";

export const TaskBoardColumn = ({ id, title, tasks, onTaskClick }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex flex-col gap-6 p-6 rounded-[2rem] transition-all duration-200 min-h-[600px] border border-transparent shadow-sm",
        isOver ? "bg-primary/5 ring-2 ring-primary/20 ring-inset border-primary/10 shadow-xl" : "bg-secondary/10"
      )}
    >
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className={cn(
            "size-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]",
            title === "To Do" ? "bg-blue-500" : title === "In Progress" ? "bg-amber-500" : "bg-emerald-500"
          )} />
          <h2 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{title}</h2>
        </div>
        <Badge variant="secondary" className="font-black text-[10px] rounded-lg bg-background/50 border-primary/5 px-3">{tasks.length}</Badge>
      </div>

      <div className="space-y-5">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-primary/5 rounded-[1.5rem] bg-background/20"
            >
              <div className="size-10 bg-secondary/30 rounded-full flex items-center justify-center mb-3">
                <Plus className="size-4 text-muted-foreground/30" />
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-30 italic text-center px-4">Drop tasks here</p>
            </motion.div>
          ) : (
            tasks.map((task) => (
              <TaskBoardCard 
                key={task._id} 
                task={task} 
                onClick={() => onTaskClick(task._id)} 
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
