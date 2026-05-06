import { useEffect, useState } from "react";
import { 
  Search, 
  FileText, 
  CheckSquare, 
  Users, 
  Settings, 
  Calendar, 
  Zap,
  ArrowRight,
  History,
  Layout
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";

const CommandPalette = ({ open, onOpenChange }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  const items = [
    { icon: Layout, label: "Dashboard", description: "Return to your command center", href: "/", shortcut: "D" },
    { icon: FileText, label: "Projects", description: "View all active tactical projects", href: "/workspaces", shortcut: "P" },
    { icon: CheckSquare, label: "My Tasks", description: "See objectives assigned to you", href: "/my-tasks", shortcut: "T" },
    { icon: History, label: "Activity", description: "View recent workspace audit trail", href: "/activity", shortcut: "A" },
    { icon: Settings, label: "Settings", description: "Configure workspace parameters", href: "/settings", shortcut: "," },
  ];

  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(prev => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onOpenChange]);

  const handleSelect = (href) => {
    const url = workspaceId ? `${href}?workspaceId=${workspaceId}` : href;
    navigate(url);
    onOpenChange(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl glass rounded-[2rem]">
        <DialogTitle className="sr-only">Command Center</DialogTitle>
        <div className="flex items-center border-b border-primary/10 px-6 h-16">
          <Search className="size-5 text-primary mr-4 opacity-50" />
          <Input 
            autoFocus
            placeholder="Search tactical data, commands, or navigation..." 
            className="flex-1 bg-transparent border-none focus-visible:ring-0 text-lg h-full font-bold placeholder:font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary/50 rounded-lg text-[10px] font-black text-muted-foreground border border-primary/5 shadow-sm">
            <span className="text-xs uppercase tracking-widest">ESC</span>
          </div>
        </div>
        
        <div className="max-h-[450px] overflow-y-auto p-4 custom-scrollbar">
          <div className="px-3 py-3 text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-70">
            Intelligent Navigation
          </div>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.label}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  onClick={() => handleSelect(item.href)}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-primary/5 cursor-pointer group transition-all duration-300 border border-transparent hover:border-primary/10 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner group-hover:rotate-6">
                      <item.icon className="size-6" />
                    </div>
                    <div>
                      <div className="text-base font-black tracking-tight group-hover:text-primary transition-colors">{item.label}</div>
                      <div className="text-xs text-muted-foreground font-medium">{item.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                      <div className="text-[10px] font-black uppercase tracking-widest bg-secondary px-2.5 py-1 rounded-lg border border-primary/5">
                        {item.shortcut}
                      </div>
                      <ArrowRight className="size-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredItems.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <div className="size-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground/20">
                  <Search className="size-8" />
                </div>
                <p className="text-muted-foreground font-bold italic text-sm tracking-tight">No tactical protocols found matching your query.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-5 bg-primary/5 flex items-center justify-between border-t border-primary/10">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <Zap className="size-4 text-primary animate-pulse" />
            <span>SmartSearch active: Press ⌘K to trigger anywhere</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-primary/50 italic tracking-tighter">ProjX Intelligence v2.0</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
