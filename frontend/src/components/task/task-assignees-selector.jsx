import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useUpdateTaskAssigneesMutation } from "@/hooks/use-task";
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "../ui/dropdown-menu";
import { Users, Plus, Check, X, Loader2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export const TaskAssigneesSelector = ({ task, assignees = [], projectMembers = [] }) => {
  const [selectedIds, setSelectedIds] = useState(
    assignees.map((assignee) => assignee._id)
  );
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useUpdateTaskAssigneesMutation();

  const handleSelect = (id) => {
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter((sid) => sid !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelected);
  };

  const handleSave = () => {
    mutate(
      {
        taskId: task._id,
        assignees: selectedIds,
      },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success("Team updated successfully");
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to update team");
        },
      }
    );
  };

  const currentAssignees = projectMembers.filter(m => selectedIds.includes(m.user._id));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {currentAssignees.length === 0 ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/30 border border-primary/5 text-muted-foreground italic text-[10px] font-black uppercase tracking-widest">
            <Users className="size-3" />
            Unassigned
          </div>
        ) : (
          currentAssignees.map((m) => (
            <div
              key={m.user._id}
              className="flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-xl px-3 py-1.5 shadow-sm group/assignee"
            >
              <Avatar className="size-6 border border-primary/10">
                <AvatarImage src={m.user.profilePicture} />
                <AvatarFallback className="text-[8px] font-black">{m.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-[11px] font-bold">{m.user.name}</span>
            </div>
          ))
        )}

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 w-9 rounded-full p-0 glass border-primary/10 hover:bg-primary/10">
              <Plus className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="glass border-primary/10 rounded-2xl p-2 min-w-[280px] shadow-2xl">
            <div className="p-3 mb-2 border-b border-primary/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Users className="size-3" />
                Select Mission Crew
              </p>
            </div>
            
            <ScrollArea className="h-64 pr-2">
              <div className="space-y-1">
                {projectMembers.map((m) => (
                  <div
                    key={m.user._id}
                    onClick={() => handleSelect(m.user._id)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer hover:bg-primary/5 transition-colors group/item"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 border border-primary/10">
                        <AvatarImage src={m.user.profilePicture} />
                        <AvatarFallback className="font-black text-[10px]">{m.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-black">{m.user.name}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 italic leading-none">{m.role}</span>
                      </div>
                    </div>
                    {selectedIds.includes(m.user._id) ? (
                      <div className="size-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                        <Check className="size-3" strokeWidth={4} />
                      </div>
                    ) : (
                      <div className="size-5 rounded-full border border-primary/20 group-hover/item:border-primary transition-colors" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <DropdownMenuSeparator className="bg-primary/5 my-2" />
            <div className="p-2 flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest h-10"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                className="flex-1 rounded-xl bg-primary shadow-lg shadow-primary/20 text-[10px] font-black uppercase tracking-widest h-10 gap-2"
                disabled={isPending}
                onClick={handleSave}
              >
                {isPending ? <Loader2 className="size-3 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};