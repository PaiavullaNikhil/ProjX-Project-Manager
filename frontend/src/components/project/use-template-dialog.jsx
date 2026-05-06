import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace";
import { useCreateProjectMutation } from "@/hooks/use-project";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2, Briefcase } from "lucide-react";

export const UseTemplateDialog = ({ open, onOpenChange, template }) => {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspacesQuery();
  const { mutate: createProject, isPending } = useCreateProjectMutation();
  
  // Get members of the selected workspace
  const selectedWorkspace = workspaces?.find(w => w._id === selectedWorkspaceId);
  const workspaceMembers = selectedWorkspace?.members || [];
  const navigate = useNavigate();

  const handleDeploy = () => {
    if (!selectedWorkspaceId) {
      toast.error("Please select a workspace to deploy this architecture.");
      return;
    }

    createProject({
      workspaceId: selectedWorkspaceId,
      projectData: {
        title: template.title,
        description: template.description,
        status: "Planning",
        startDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        tags: template.tags.join(","),
        initialTasks: template.initialTasks,
        members: selectedMembers.map(userId => ({ user: userId, role: "contributor" }))
      },
    }, {
      onSuccess: (data) => {
        toast.success(`Template deployed successfully!`, {
          description: `Architecture '${template.title}' is now live.`,
        });
        onOpenChange(false);
        navigate(`/workspaces/${selectedWorkspaceId}/projects/${data._id}`);
      },
      onError: (error) => {
        toast.error("Deployment failed", {
          description: error.response?.data?.message || "Internal system error during instantiation.",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-primary/10 rounded-[2.5rem] max-w-md p-8 overflow-hidden shadow-2xl">
        <DialogHeader>
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-lg">
            <Briefcase className="size-6" />
          </div>
          <DialogTitle className="text-3xl font-black tracking-tight leading-none">
            Deploy Architecture
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-muted-foreground mt-2">
            Configure where you want to instantiate the <span className="text-primary font-bold">'{template?.title}'</span> framework.
          </DialogDescription>
        </DialogHeader>

        <div className="py-8 space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Target Workspace</label>
            <Select onValueChange={(val) => { setSelectedWorkspaceId(val); setSelectedMembers([]); }} value={selectedWorkspaceId}>
              <SelectTrigger className="h-14 rounded-xl glass border-primary/5 shadow-inner focus:ring-primary/20 transition-all font-bold text-sm">
                <SelectValue placeholder="Select Deployment Zone" />
              </SelectTrigger>
              <SelectContent className="glass border-primary/10 rounded-xl">
                {workspacesLoading ? (
                  <div className="p-4 flex items-center justify-center">
                    <Loader2 className="size-4 animate-spin text-primary" />
                  </div>
                ) : workspaces?.length === 0 ? (
                  <div className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">No Workspaces Found</div>
                ) : (
                  workspaces?.map((workspace) => (
                    <SelectItem key={workspace._id} value={workspace._id} className="rounded-lg focus:bg-primary/10 font-bold transition-colors">
                      {workspace.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedWorkspaceId && workspaceMembers.length > 1 && (
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Team Assignment</label>
              <ScrollArea className="h-32 rounded-xl glass border-primary/5 p-4 shadow-inner">
                <div className="space-y-3">
                  {workspaceMembers.filter(m => m.user._id !== selectedWorkspace?.owner).map((member) => (
                    <div key={member.user._id} className="flex items-center gap-3">
                      <Checkbox 
                        id={member.user._id} 
                        checked={selectedMembers.includes(member.user._id)}
                        onCheckedChange={(checked) => {
                          if (checked) setSelectedMembers([...selectedMembers, member.user._id]);
                          else setSelectedMembers(selectedMembers.filter(id => id !== member.user._id));
                        }}
                      />
                      <label htmlFor={member.user._id} className="text-xs font-bold cursor-pointer select-none">{member.user.name}</label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <div className="p-4 bg-secondary/20 rounded-2xl border border-primary/5">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3">Included in this Template</p>
            <div className="space-y-2">
              {template?.initialTasks?.map((task, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-primary/40 shrink-0" />
                  <span className="text-[11px] font-bold text-foreground/80">{task.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-black uppercase tracking-widest text-[10px]">Cancel</Button>
          <Button 
            onClick={handleDeploy} 
            disabled={isPending}
            className="flex-1 rounded-xl h-12 shadow-xl shadow-primary/20 bg-primary font-black uppercase tracking-widest text-[10px] gap-2"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Confirm Deployment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
