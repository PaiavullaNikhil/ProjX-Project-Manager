import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Users, 
  Settings, 
  Compass, 
  CheckCircle2,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();
  const actions = [
    { icon: Plus, label: "New Project", color: "bg-blue-500", action: () => {} },
    { icon: CheckCircle2, label: "New Task", color: "bg-emerald-500", action: () => {} },
    { icon: Users, label: "Invite Team", color: "bg-indigo-500", action: () => navigate("/members") },
    { icon: Compass, label: "Explore", color: "bg-pink-500", action: () => navigate("/explore") },
    { icon: Rocket, label: "Templates", color: "bg-orange-500", action: () => navigate("/explore") },
    { icon: Settings, label: "Settings", color: "bg-slate-600", action: () => navigate("/settings") },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -5 }}
        >
          <Button
            variant="outline"
            onClick={action.action}
            className="w-full h-auto py-6 flex flex-col gap-3 glass-morphism hover:bg-primary/5 border-primary/5 transition-all duration-500 group rounded-[1.5rem]"
          >
            <div className={`p-3 rounded-2xl ${action.color} text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
              <action.icon className="size-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
              {action.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickActions;
