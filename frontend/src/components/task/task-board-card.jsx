import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, GripVertical } from "lucide-react";
import { format } from "date-fns";

export const TaskBoardCard = ({ task, onClick, isOverlay }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 1000 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative touch-none",
        isDragging && !isOverlay && "opacity-0"
      )}
    >
      <motion.div
        layout={!isDragging}
        transition={{ duration: 0.15 }}
      >
        <Card 
          onClick={onClick} 
          {...attributes}
          {...listeners}
          className={cn(
            "group cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow duration-200 border-primary/5 glass overflow-hidden rounded-2xl relative select-none",
            isOverlay && "shadow-2xl ring-2 ring-primary border-transparent scale-105 rotate-1 opacity-90",
            isDragging && !isOverlay && "invisible"
          )}
        >
          <CardHeader className="p-5 pb-3">
            <div className="flex items-center justify-between gap-3 pointer-events-none">
              <Badge 
                variant="secondary"
                className={cn(
                  "text-[9px] px-2.5 py-0.5 uppercase font-black tracking-widest border",
                  task.priority === "High" ? "bg-red-500/10 text-red-500 border-red-500/10" : 
                  task.priority === "Medium" ? "bg-amber-500/10 text-amber-500 border-amber-500/10" : 
                  "bg-slate-500/10 text-slate-500 border-slate-500/10"
                )}
              >
                {task.priority}
              </Badge>
              
              <div className="p-1.5 bg-primary/5 rounded-lg">
                <GripVertical className="size-4 text-primary/40" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 pointer-events-none">
            <h4 className="font-black text-base mb-2 group-hover:text-primary transition-colors tracking-tight leading-snug">{task.title}</h4>
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed font-medium">
                {task.description}
              </p>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-primary/5">
              <div className="flex items-center gap-2">
                {task.assignees && task.assignees.length > 0 && (
                  <div className="flex -space-x-2">
                    {task.assignees.slice(0, 3).map((member) => (
                      <Avatar key={member._id} className="size-7 rounded-lg border-2 border-background shadow-md">
                        <AvatarImage src={member.profilePicture} className="object-cover" />
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-black uppercase">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-end gap-1.5">
                {task.dueDate && (
                  <div className={cn(
                    "text-[9px] flex items-center font-black uppercase tracking-widest",
                    new Date(task.dueDate) < new Date() && task.status !== "Done" ? "text-red-500" : "text-muted-foreground/60"
                  )}>
                    <Calendar className="size-3 mr-1.5" />
                    {format(new Date(task.dueDate), "MMM d")}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
