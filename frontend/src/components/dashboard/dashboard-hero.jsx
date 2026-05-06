import { motion } from "framer-motion";
import { Zap, Target, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DashboardHero = ({ user, stats }) => {
  const completionRate = stats.totalTasks > 0 ? Math.round((stats.totalTaskCompleted / stats.totalTasks) * 100) : 0;
  
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/15 via-primary/5 to-background border border-primary/10 p-10 mb-10 shadow-2xl">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute -top-24 -right-24 size-80 bg-primary/20 rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-24 -left-24 size-80 bg-blue-500/15 rounded-full blur-3xl opacity-60" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 grid gap-12 lg:grid-cols-5 items-center">
        <div className="lg:col-span-3 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="size-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Command Center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-4">
              Welcome back, <span className="text-gradient">{user?.displayName || user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium max-w-xl leading-relaxed">
              You've conquered <span className="text-foreground font-black underline decoration-primary/30 underline-offset-4">{stats.totalTaskCompleted} tasks</span> this week. Your current efficiency is in the top <span className="text-foreground font-black">5%</span> of your workspace.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-4">
            <Button className="h-12 px-8 rounded-2xl shadow-xl shadow-primary/20 gap-3 group">
              <Zap className="size-4 group-hover:fill-current transition-all" />
              <span>Deploy Task</span>
            </Button>
            <Button variant="outline" className="h-12 px-8 rounded-2xl gap-3 glass group border-primary/10">
              <Target className="size-4 group-hover:scale-125 transition-transform" />
              <span>Update Strategy</span>
              <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-morphism border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden relative group rounded-[2rem]">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-all duration-700 rotate-12 group-hover:rotate-45">
                <TrendingUp className="size-24 text-primary" />
              </div>
              
              <CardContent className="p-8">
                <div className="flex items-center gap-5 mb-8">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg shadow-primary/30">
                    <TrendingUp className="size-7" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Peak Productivity</div>
                    <div className="text-3xl font-black tracking-tighter">{completionRate}%</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Weekly Progress</span>
                    <span className="text-sm font-black text-primary">{completionRate}% Completed</span>
                  </div>
                  <div className="relative h-3 w-full bg-primary/10 rounded-full overflow-hidden border border-primary/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                      Real-time analytics active
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
