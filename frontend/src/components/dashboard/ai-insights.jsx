import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BrainCircuit, ShieldCheck, Zap, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AIInsights = ({ intelligence }) => {
  const { velocity = 0, bottleneck = null, criticalTasks = [] } = intelligence || {};

  const insights = [
    {
      title: velocity >= 0 ? "Velocity Increasing" : "Velocity Decreasing",
      description: velocity >= 0 
        ? `Your team completed ${velocity}% more tasks this week compared to last week. Great momentum!` 
        : `Output is down by ${Math.abs(velocity)}% this week. Consider reviewing roadblocks.`,
      icon: velocity >= 0 ? TrendingUp : TrendingDown,
      color: velocity >= 0 ? "text-emerald-500" : "text-orange-500",
      bg: velocity >= 0 ? "bg-emerald-500/10" : "bg-orange-500/10"
    },
    {
      title: criticalTasks.length > 0 ? "Deadline Pressure" : "Safe Schedule",
      description: criticalTasks.length > 0 
        ? `${criticalTasks.length} high-priority tasks are approaching their deadlines. Resources may need shifting.`
        : "No high-priority tasks are nearing their deadlines. Schedule looks stable.",
      icon: ShieldCheck,
      color: criticalTasks.length > 0 ? "text-red-500" : "text-blue-500",
      bg: criticalTasks.length > 0 ? "bg-red-500/10" : "bg-blue-500/10"
    },
    {
      title: bottleneck ? "Workflow Bottleneck" : "Optimal Workflow",
      description: bottleneck 
        ? `The '${bottleneck}' column is showing signs of congestion. Consider clearing pending items.`
        : "Tasks are moving smoothly through the pipeline with no major bottlenecks detected.",
      icon: BrainCircuit,
      color: bottleneck ? "text-amber-500" : "text-indigo-500",
      bg: bottleneck ? "bg-amber-500/10" : "bg-indigo-500/10"
    }
  ];

  return (
    <Card className="glass border-primary/10 shadow-xl overflow-hidden mb-8">
      <CardContent className="p-0">
        <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
              <Sparkles className="size-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gradient">Smart Insights</h3>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Powered by ProjX Intelligence</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/10">
            View Deep Analytics
            <ArrowRight className="size-3" />
          </Button>
        </div>
        
        <div className="p-6 grid gap-6 md:grid-cols-3">
          {insights.map((insight, index) => (
            <motion.div 
              key={insight.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <div className={`size-10 rounded-xl ${insight.bg} flex items-center justify-center ${insight.color}`}>
                <insight.icon className="size-5" />
              </div>
              <h4 className="font-bold text-sm tracking-tight">{insight.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                {insight.description}
              </p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
