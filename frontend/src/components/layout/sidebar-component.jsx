import { cn } from "@/lib/utils";
import { useAuth } from "@/provider/auth-context";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    ChevronsLeft,
    ChevronsRight,
    LayoutDashboard,
    ListCheck,
    LogOut,
    Moon,
    Settings,
    Sun,
    Users,
    Rocket,
    Compass,
    History,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarNav } from "./sidebar-nav";

export const SidebarComponent = ({ currentWorkspace }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Explore",
      href: "/explore",
      icon: Compass,
    },
    {
      title: "Activity",
      href: "/activity",
      icon: History,
    },
    {
      title: "Workspaces",
      href: "/workspaces",
      icon: Users,
    },
    {
      title: "My Tasks",
      href: "/my-tasks",
      icon: ListCheck,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col border-r transition-all duration-500 relative z-10 glass shadow-2xl",
        isCollapsed ? "w-16 md:w-[80px]" : "w-16 md:w-[260px]"
      )}
    >
      <div className="flex h-20 items-center px-4 mb-4">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <Rocket className="size-6 text-primary-foreground fill-current" />
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-black text-xl tracking-tighter text-gradient">
                ProjX
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-none">
                Intelligence
              </span>
            </motion.div>
          )}
        </Link>

        {!isCollapsed && (
          <Button
            variant={"ghost"}
            size="icon"
            className="ml-auto hidden md:flex hover:bg-primary/10 rounded-xl"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronsLeft className="size-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-4">
          <SidebarNav
            items={navItems}
            isCollapsed={isCollapsed}
            className={cn(isCollapsed && "items-center space-y-2")}
            currentWorkspace={currentWorkspace}
          />
        </div>
      </ScrollArea>

      <div className="p-4 space-y-2 border-t border-primary/5">
        {isCollapsed && (
          <Button
            variant={"ghost"}
            size="icon"
            className="mx-auto flex hover:bg-primary/10 rounded-xl mb-2"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronsRight className="size-4" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "default"}
          className={cn(
            "w-full justify-start hover:bg-primary/10 rounded-xl font-bold uppercase tracking-widest text-[10px]",
            isCollapsed && "justify-center"
          )}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className={cn("size-4", !isCollapsed && "mr-3")} />
          ) : (
            <Moon className={cn("size-4", !isCollapsed && "mr-3")} />
          )}
          {!isCollapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </Button>

        <Button
          variant={"ghost"}
          size={isCollapsed ? "icon" : "default"}
          className={cn(
            "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl font-bold uppercase tracking-widest text-[10px]",
            isCollapsed && "justify-center"
          )}
          onClick={logout}
        >
          <LogOut className={cn("size-4", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );
};
