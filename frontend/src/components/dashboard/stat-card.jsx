import { motion } from "framer-motion";
import { FolderKanban, ListChecks, Timer, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

const StatsCard = ({ data }) => {
  const cards = [
    {
      title: "Projects",
      value: data.totalProjects,
      description: `${data.totalProjectInProgress} active workflows`,
      icon: FolderKanban,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Task Scope",
      value: data.totalTasks,
      description: `${data.totalTaskCompleted} objectives met`,
      icon: ListChecks,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "In Queue",
      value: data.totalTaskToDo,
      description: "Awaiting deployment",
      icon: Timer,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    {
      title: "Active",
      value: data.totalTaskInProgress,
      description: "In high-speed execution",
      icon: CheckCircle2,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10"
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass border-primary/5 hover:border-primary/20 transition-all duration-500 group rounded-3xl overflow-hidden relative shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <card.icon className="size-16" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6">
              <div className={`p-2 rounded-xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                <card.icon className="size-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                {card.title}
              </span>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="text-3xl font-black tracking-tighter mb-1">{card.value}</div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {card.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCard;