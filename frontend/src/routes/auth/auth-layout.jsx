import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../provider/auth-context";
import { motion } from "framer-motion";
import { Loader } from "@/components/Loader";

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden">
      {/* Left Side: Branding & Illustration (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col w-1/2 relative bg-secondary/30 border-r border-primary/5">
        <div className="absolute inset-0 z-0">
          <img 
            src="/auth-bg.png" 
            alt="Auth Background" 
            className="w-full h-full object-cover grayscale-[0.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/40 to-transparent" />
        </div>
        
        <div className="relative z-10 p-16 flex flex-col h-full justify-between">
          <div className="flex items-center space-x-3">
            <div className="size-11 bg-primary rounded-xl flex items-center justify-center shadow-2xl shadow-primary/40">
              <span className="text-2xl font-bold text-primary-foreground italic">P</span>
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">ProjX</span>
          </div>

          <div className="space-y-8 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-bold text-primary-foreground mb-6">
                <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                <span>v2.0 IS NOW LIVE</span>
              </div>
              <h2 className="text-6xl font-black leading-[1.1] tracking-tighter text-white drop-shadow-sm">
                Orchestrate <br />
                <span className="text-primary italic brightness-125 drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]">Excellence.</span>
              </h2>
              <p className="text-xl text-slate-300 mt-6 leading-relaxed font-medium max-w-md">
                The world's most intuitive platform for teams that demand precision, speed, and beautiful workflows.
              </p>
            </motion.div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/30">
            <span>© PROJX PLATFORM 2025</span>
            <div className="flex items-center gap-4">
              <span className="hover:text-primary transition-colors cursor-pointer">PRIVACY</span>
              <span className="hover:text-primary transition-colors cursor-pointer">TERMS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full flex items-center justify-center z-10"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};
 
export default AuthLayout;