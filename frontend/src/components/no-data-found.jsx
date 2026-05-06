import { CirclePlus, LayoutGrid, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export const NoDataFound = ({
  title,
  description,
  buttonText,
  buttonAction,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-full text-center py-20 2xl:py-32 glass border-primary/5 rounded-[3rem] shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent)] pointer-events-none" />
      <div className="relative z-10 space-y-6">
        <div className="size-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner border border-primary/5">
          <LayoutGrid className="size-10 text-primary opacity-50" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-black tracking-tight text-gradient">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium leading-relaxed">
            {description}
          </p>
        </div>

        {buttonAction && (
          <Button onClick={buttonAction} className="h-12 px-8 rounded-2xl shadow-xl shadow-primary/20 gap-3 group">
            <CirclePlus className="size-4 group-hover:rotate-90 transition-transform duration-500" />
            <span className="font-black uppercase tracking-widest text-[10px]">{buttonText}</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
};
