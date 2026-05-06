import { useGetWorkspacesQuery } from "@/hooks/use-workspace";
import { useAuth } from "@/provider/auth-context";
import { Bell, PlusCircle, Search, ChevronDown, User, LogOut, UserCircle } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { WorkspaceAvatar } from "../workspace/workspace-avatar";
import CommandPalette from "./command-palette";
import NotificationCenter from "./notification-center";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Header = ({
  onWorkspaceSelected,
  selectedWorkspace,
  onCreateWorkspace,
}) => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data: workspacesData = [], isLoading } = useGetWorkspacesQuery();
  const isOnWorkspacePage = useLocation().pathname.includes("/workspace");

  const handleOnClick = (workspace) => {
    onWorkspaceSelected(workspace);
    const location = window.location;

    if (isOnWorkspacePage) {
      navigate(`/workspaces/${workspace._id}`);
    } else {
      const basePath = location.pathname;
      navigate(`${basePath}?workspaceId=${workspace._id}`);
    }
  };

  return (
    <div className="bg-background/80 backdrop-blur-xl sticky top-0 z-40 border-b border-primary/5 h-20 flex items-center">
      <div className="flex w-full items-center justify-between px-6 sm:px-8 lg:px-10">
        
        {/* Left: Workspace Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-12 px-4 rounded-2xl glass border border-primary/5 hover:bg-primary/5 gap-3 group">
              {selectedWorkspace ? (
                <>
                  <motion.div whileHover={{ rotate: 10 }} className="shrink-0">
                    <WorkspaceAvatar
                      color={selectedWorkspace.color}
                      name={selectedWorkspace.name}
                      className="size-8 rounded-lg shadow-lg"
                    />
                  </motion.div>
                  <div className="text-left hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">Workspace</p>
                    <p className="text-sm font-black tracking-tight">{selectedWorkspace.name}</p>
                  </div>
                </>
              ) : (
                <span className="font-black text-xs uppercase tracking-widest">Deploy Hub</span>
              )}
              <ChevronDown className="size-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-64 glass border-primary/10 shadow-2xl p-2 rounded-2xl">
            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest px-3 py-2 text-muted-foreground">Select Infrastructure</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-primary/5" />

            <DropdownMenuGroup className="max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-xs font-bold text-muted-foreground italic">Syncing...</div>
              ) : (
                workspacesData.map((ws) => (
                  <DropdownMenuItem 
                    key={ws._id} 
                    onClick={() => handleOnClick(ws)}
                    className={cn(
                      "rounded-xl px-3 py-2.5 mb-1 cursor-pointer transition-all",
                      selectedWorkspace?._id === ws._id ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
                    )}
                  >
                    <WorkspaceAvatar color={ws.color} name={ws.name} className="size-6 rounded-md" />
                    <span className="ml-3 text-sm font-bold">{ws.name}</span>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-primary/5" />
            <DropdownMenuItem onClick={onCreateWorkspace} className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-primary/5 text-primary">
              <PlusCircle className="size-4 mr-3" />
              <span className="text-sm font-black uppercase tracking-widest text-[10px]">Create Workspace</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Center: Command Palette Trigger */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-12">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="w-full"
          >
            <Button 
              variant="outline" 
              className="w-full h-12 justify-between glass border-primary/5 text-muted-foreground font-medium group hover:bg-primary/[0.03] hover:border-primary/20 transition-all rounded-2xl px-6"
              onClick={() => setIsCommandOpen(true)}
            >
              <div className="flex items-center gap-4">
                <div className="p-1.5 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                  <Search className="size-4 text-primary" />
                </div>
                <span className="text-xs font-bold tracking-tight group-hover:text-foreground transition-colors uppercase tracking-[0.1em]">Search tactical data...</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="pointer-events-none hidden h-6 select-none items-center gap-1 rounded-lg border bg-muted/50 px-2 font-mono text-[10px] font-black opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </Button>
          </motion.div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <NotificationCenter />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative group shrink-0">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="size-11 rounded-2xl p-0.5 bg-gradient-to-br from-primary/20 to-blue-500/20 group-hover:from-primary/40 group-hover:to-blue-500/40 transition-all"
                >
                  <Avatar className="size-full rounded-[0.9rem] border-2 border-background">
                    <AvatarImage src={user?.profilePicture} alt={user?.name} className="object-cover" />
                    <AvatarFallback className="bg-primary text-primary-foreground font-black text-xs">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 glass border-primary/10 shadow-2xl p-2 rounded-2xl">
              <DropdownMenuLabel className="px-3 py-3">
                <p className="text-xs font-black tracking-tight">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground font-medium truncate">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-primary/5" />
              <DropdownMenuItem onClick={() => navigate("/settings")} className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-primary/5 gap-3">
                <UserCircle className="size-4 text-muted-foreground" />
                <span className="text-xs font-bold">Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-primary/5" />
              <DropdownMenuItem 
                onClick={() => { logout(); navigate("/"); }} 
                className="rounded-xl px-3 py-2.5 cursor-pointer text-red-500 hover:bg-red-500/10 gap-3"
              >
                <LogOut className="size-4" />
                <span className="text-xs font-bold">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </div>
  );
};
