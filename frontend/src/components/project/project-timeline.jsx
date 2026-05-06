import { motion } from "framer-motion";
import { format, differenceInCalendarDays, addDays, startOfWeek, eachDayOfInterval, isToday, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const ProjectTimeline = ({ tasks }) => {
  const today = startOfDay(new Date());
  const startDate = startOfWeek(today);
  const totalDays = 21; // Show 3 weeks
  const endDate = addDays(startDate, totalDays - 1);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="glass-morphism rounded-[2rem] border border-primary/5 overflow-hidden shadow-2xl">
      <ScrollArea className="w-full">
        <div className="min-w-[1000px] p-8">
          {/* Calendar Header */}
          <div className="grid grid-cols-[240px_1fr] mb-8">
            <div className="flex flex-col justify-end pb-2">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary">Project Timeline</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Task view</p>
            </div>
            <div className="flex bg-secondary/20 rounded-2xl p-1 border border-primary/5">
              {days.map((day) => (
                <div key={day.toString()} className="flex-1 text-center py-2 relative">
                  <div className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter mb-1">{format(day, "EEE")}</div>
                  <div className={cn(
                    "size-8 flex items-center justify-center rounded-xl mx-auto text-xs font-black transition-all",
                    isToday(day) ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110" : "text-foreground/70"
                  )}>
                    {format(day, "d")}
                  </div>
                  {isToday(day) && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-[1000px] bg-primary/20 z-0 pointer-events-none mt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Task Lanes */}
          <div className="space-y-4 relative z-10">
            {tasks.map((task, index) => {
              const taskStart = startOfDay(new Date(task.createdAt));
              const taskEnd = task.dueDate ? startOfDay(new Date(task.dueDate)) : addDays(taskStart, 1);
              
              // Calculate relative positioning using calendar days for precision
              const startOffset = differenceInCalendarDays(taskStart, startDate);
              const duration = Math.max(1, differenceInCalendarDays(taskEnd, taskStart) + 1);
              
              // Clamping to visible range [0, 21]
              const visibleStart = Math.max(0, startOffset);
              const visibleEnd = Math.min(totalDays, startOffset + duration);
              const visibleDuration = visibleEnd - visibleStart;
              
              // Hide tasks completely outside range
              if (visibleDuration <= 0) return null;

              const width = (visibleDuration / totalDays) * 100;
              const left = (visibleStart / totalDays) * 100;

              return (
                <motion.div 
                  key={task._id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-[240px_1fr] group items-center"
                >
                  <div className="pr-6 flex items-center gap-3">
                    <div className={cn(
                      "size-2 rounded-full shrink-0",
                      task.status === "Done" ? "bg-emerald-500" : 
                      task.status === "In Progress" ? "bg-blue-500" : "bg-slate-400"
                    )} />
                    <div className="truncate font-bold text-sm tracking-tight group-hover:text-primary transition-colors cursor-pointer">
                      {task.title}
                    </div>
                  </div>
                  <div className="relative h-12 bg-secondary/10 rounded-2xl overflow-hidden border border-primary/5 group-hover:bg-secondary/20 transition-colors">
                    {/* Grid Lines Overlay */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {days.map((d, i) => (
                        <div key={i} className="flex-1 border-r border-primary/5 last:border-0" />
                      ))}
                    </div>

                    <motion.div
                      layoutId={`timeline-bar-${task._id}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%`, left: `${left}%` }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                      className={cn(
                        "absolute top-2 bottom-2 rounded-xl shadow-xl flex items-center px-4 text-[10px] font-black text-white whitespace-nowrap overflow-hidden border border-white/10",
                        task.status === "Done" ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : 
                        task.status === "In Progress" ? "bg-gradient-to-r from-blue-500 to-indigo-600" : 
                        "bg-gradient-to-r from-slate-500 to-slate-600"
                      )}
                    >
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="truncate uppercase tracking-widest"
                      >
                        {task.status}
                      </motion.span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
      {/* Footer Legend */}
      <div className="p-4 bg-secondary/30 border-t border-primary/5 flex justify-center gap-6">
        <TimelineLegend color="bg-emerald-500" label="Done" />
        <TimelineLegend color="bg-blue-500" label="In Progress" />
        <TimelineLegend color="bg-slate-500" label="To Do" />
      </div>
    </div>
  );
};

const TimelineLegend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={cn("size-2 rounded-full", color)} />
    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
  </div>
);

export default ProjectTimeline;
