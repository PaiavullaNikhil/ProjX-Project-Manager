import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const SidebarNav = ({
  items,
  isCollapsed,
  className,
  currentWorkspace,
  ...props
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className={cn("flex flex-col gap-y-1.5", className)} {...props}>
      {items.map((el) => {
        const Icon = el.icon;
        const isActive = location.pathname === el.href;

        const handleClick = () => {
          if (el.href === "/workspaces") {
            navigate(el.href);
          } else if (currentWorkspace && currentWorkspace._id) {
            navigate(`${el.href}?workspaceId=${currentWorkspace._id}`);
          } else {
            navigate(el.href);
          }
        };

        return (
          <motion.div
            key={el.href}
            whileHover={{ x: isCollapsed ? 0 : 4 }}
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            {isActive && (
              <motion.div
                layoutId="active-nav"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start h-11 px-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-primary/10 text-primary font-black shadow-sm border border-primary/5" 
                  : "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
                isCollapsed && "justify-center px-0"
              )}
              onClick={handleClick}
            >
              <Icon className={cn(
                "size-5 transition-transform duration-300 group-hover:scale-110", 
                !isCollapsed && "mr-3",
                isActive && "text-primary"
              )} />
              {!isCollapsed && (
                <span className="text-xs font-bold uppercase tracking-widest truncate">
                  {el.title}
                </span>
              )}
            </Button>
          </motion.div>
        );
      })}
    </nav>
  );
};
