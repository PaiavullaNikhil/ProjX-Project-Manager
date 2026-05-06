import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertTriangle, CheckCircle2, ChevronRight, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TaskForecast = ({ tasks = [] }) => {
  return (
    <Card className="glass border-primary/10 shadow-2xl overflow-hidden group h-full">
      <CardHeader className="p-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:rotate-12 transition-transform">
              <Clock className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-black tracking-tight">Task Forecast</CardTitle>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Upcoming Deadlines</p>
            </div>
          </div>
          <Badge variant="outline" className="rounded-lg glass border-primary/20 text-primary">
            {tasks.length} Pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.length > 0 ? (
            tasks.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group/item flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-transparent hover:border-primary/10 hover:bg-secondary/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={cn(
                    "size-10 rounded-xl flex items-center justify-center shrink-0",
                    item.severity === "critical" ? "bg-red-500/10 text-red-500" :
                    item.severity === "warning" ? "bg-yellow-500/10 text-yellow-500" :
                    "bg-blue-500/10 text-blue-500"
                  )}>
                    {item.severity === "critical" ? <AlertTriangle className="size-5" /> :
                     item.severity === "warning" ? <Calendar className="size-5" /> :
                     <CheckCircle2 className="size-5" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold tracking-tight group-hover/item:text-primary transition-colors truncate">{item.title}</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">{item.project}</div>
                  </div>
                </div>
                
                <div className="text-right shrink-0 ml-4">
                  <div className={cn(
                    "text-xs font-black tracking-tight",
                    item.severity === "critical" ? "text-red-500" : "text-foreground"
                  )}>
                    {item.due}
                  </div>
                  <div className="flex items-center justify-end text-[10px] font-bold text-muted-foreground mt-0.5 group-hover/item:text-primary transition-colors">
                    Details <ChevronRight className="size-3 ml-0.5 group-hover/item:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="size-12 bg-secondary/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
                <CheckCircle2 className="size-6" />
              </div>
              <p className="text-xs text-muted-foreground font-medium italic">All clear! No upcoming deadlines.</p>
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default TaskForecast;
