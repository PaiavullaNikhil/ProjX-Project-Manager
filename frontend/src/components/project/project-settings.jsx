import { useState } from "react";
import { useUpdateProjectMutation, useDeleteProjectMutation } from "@/hooks/use-project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { 
  Trash2, 
  Save, 
  AlertTriangle,
  Settings as SettingsIcon,
  Loader2,
  Users,
  Plus
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useGetWorkspaceMembersQuery } from "@/hooks/use-workspace";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const ProjectSettings = ({ project, workspaceId }) => {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description || "");
  const navigate = useNavigate();

  const { mutate: updateProject, isPending: isUpdating } = useUpdateProjectMutation();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProjectMutation();

  const handleUpdate = () => {
    if (title.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }

    updateProject({
      projectId: project._id,
      projectData: { title, description }
    }, {
      onSuccess: () => {
        toast.success("Project updated successfully");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to update project");
      }
    });
  };

  const handleUpdateMembers = (newMembers) => {
    updateProject({
      projectId: project._id,
      projectData: { members: newMembers }
    }, {
      onSuccess: () => toast.success("Team updated"),
      onError: () => toast.error("Failed to update team")
    });
  };

  const { data: workspaceMembers } = useGetWorkspaceMembersQuery(workspaceId);

  const handleDelete = () => {
    deleteProject({ projectId: project._id }, {
      onSuccess: () => {
        toast.success("Project deleted permanently");
        navigate(`/workspaces/${workspaceId}`);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to delete project");
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* General Settings */}
      <section className="glass p-10 rounded-[2.5rem] border border-primary/5 shadow-2xl space-y-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <SettingsIcon className="size-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Project Identity</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic">Update core project details</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Project Title</label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="h-14 rounded-2xl glass border-primary/10 focus:ring-primary/20 font-bold text-lg px-6 shadow-inner"
              placeholder="Enter project name..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mission Description</label>
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-2xl glass border-primary/10 focus:ring-primary/20 font-medium min-h-[150px] p-6 shadow-inner leading-relaxed"
              placeholder="What is this mission about?"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleUpdate} 
              disabled={isUpdating}
              className="h-12 px-10 rounded-xl bg-primary shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-[10px] gap-2 group"
            >
              {isUpdating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Save className="size-4 group-hover:scale-110 transition-transform" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Team Management */}
      <section className="glass p-10 rounded-[2.5rem] border border-primary/5 shadow-2xl space-y-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Users className="size-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Team Access</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic">Manage who has access to this mission</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 rounded-xl font-black uppercase tracking-widest text-[9px] gap-2 glass border-primary/10">
                <Plus className="size-3" />
                Add Member
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass border-primary/10 rounded-xl p-2 min-w-[240px]">
              <div className="p-2 mb-2 border-b border-primary/5">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Select Workspace Member</p>
              </div>
              <ScrollArea className="h-48">
                {workspaceMembers?.map(member => (
                  <DropdownMenuItem 
                    key={member.user._id}
                    disabled={project.members.some(m => m.user._id === member.user._id)}
                    onClick={() => {
                      const newMembers = [...project.members.map(m => ({ user: m.user._id, role: m.role })), { user: member.user._id, role: "contributor" }];
                      handleUpdateMembers(newMembers);
                    }}
                    className="rounded-lg gap-3 py-2 cursor-pointer"
                  >
                    <Avatar className="size-6">
                      <AvatarImage src={member.user.profilePicture} />
                      <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-bold text-xs">{member.user.name}</span>
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid gap-4">
          {project.members.map((member) => (
            <div key={member.user._id} className="flex items-center justify-between p-5 rounded-2xl border border-primary/5 bg-primary/[0.02] group/member">
              <div className="flex items-center gap-4">
                <Avatar className="size-10 border border-primary/10">
                  <AvatarImage src={member.user.profilePicture} />
                  <AvatarFallback className="font-black text-xs">{member.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-sm leading-none mb-1">{member.user.name}</h4>
                  <p className="text-[9px] font-black uppercase tracking-widest text-primary/60 italic">{member.role}</p>
                </div>
              </div>

              {member.user._id !== project.createdBy && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    const newMembers = project.members
                      .filter(m => m.user._id !== member.user._id)
                      .map(m => ({ user: m.user._id, role: m.role }));
                    handleUpdateMembers(newMembers);
                  }}
                  className="rounded-xl opacity-0 group-hover/member:opacity-100 transition-opacity hover:bg-red-500/10 hover:text-red-500"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="glass p-10 rounded-[2.5rem] border border-red-500/10 shadow-2xl shadow-red-500/5 space-y-8 bg-red-500/[0.02]">
        <div className="flex items-center gap-4 mb-2">
          <div className="size-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertTriangle className="size-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-red-500">Danger Zone</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-red-500/60 italic">Irreversible actions</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-3xl border border-red-500/10 bg-red-500/5 gap-6">
          <div className="space-y-1">
            <h4 className="font-black text-sm uppercase tracking-tight">Delete this project</h4>
            <p className="text-xs text-muted-foreground font-medium">Once you delete a project, there is no going back. Please be certain.</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 shadow-xl shadow-red-500/20"
              >
                <Trash2 className="size-4" />
                Delete Project
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-red-500/20 rounded-[2rem] p-10 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight">Are you absolutely sure?</DialogTitle>
                <DialogDescription className="font-medium text-muted-foreground leading-relaxed">
                  This will permanently delete the <span className="text-foreground font-bold">"{project.title}"</span> mission, all its tasks, activity logs, and attachments. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-3 mt-6">
                <Button variant="outline" onClick={() => document.querySelector('[data-state="open"]')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))} className="rounded-xl font-black uppercase tracking-widest text-[10px] h-12">Cancel</Button>
                <Button 
                  onClick={handleDelete}
                  className="rounded-xl font-black uppercase tracking-widest text-[10px] h-12 bg-red-600 hover:bg-red-700 shadow-xl shadow-red-600/20"
                >
                  Confirm Permanent Deletion
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
};
