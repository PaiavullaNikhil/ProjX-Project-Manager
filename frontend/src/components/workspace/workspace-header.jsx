import { WorkspaceAvatar } from "./workspace-avatar";
import { Button } from "../ui/button";
import { Plus, UserPlus, Info, Layout, Users, Activity } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export const WorkspaceHeader = ({
  workspace,
  members,
  onCreateProject,
  onInviteMember,
  activeTasks,
}) => {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/10 p-8 mb-8">
      {/* Decorative Blur */}
      <div className="absolute -top-24 -right-24 size-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-24 -left-24 size-64 bg-blue-500/10 rounded-full blur-3xl opacity-50" />

      <div className="relative z-10 space-y-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div className="flex items-start gap-5">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-1 rounded-2xl bg-background shadow-2xl border border-primary/10"
            >
              {workspace.color && (
                <WorkspaceAvatar color={workspace.color} name={workspace.name} className="size-16 rounded-xl" />
              )}
            </motion.div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-gradient">
                  {workspace.name}
                </h1>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-widest text-[10px]">
                  Workspace
                </Badge>
              </div>
              {workspace.description && (
                <p className="text-muted-foreground max-w-xl leading-relaxed font-medium">
                  {workspace.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={onInviteMember} className="rounded-xl glass group">
              <UserPlus className="size-4 mr-2 group-hover:scale-110 transition-transform" />
              Invite Team
            </Button>
            <Button onClick={onCreateProject} className="rounded-xl shadow-lg shadow-primary/20 group">
              <Plus className="size-4 mr-2 group-hover:rotate-90 transition-transform duration-500" />
              New Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatWidget icon={Layout} label="Total Projects" value={workspace.projects?.length || 0} />
          <StatWidget icon={Users} label="Team Members" value={members.length} />
          <StatWidget icon={Activity} label="Active Tasks" value={activeTasks || 0} />
          <StatWidget icon={Info} label="Workspace Health" value="Stable" color="text-green-500" />
        </div>

        {members.length > 0 && (
          <div className="flex items-center gap-4 pt-4 border-t border-primary/5">
            <div className="flex -space-x-3">
              {members.map((member, i) => (
                <motion.div
                  key={member._id}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Avatar className="size-10 border-4 border-background shadow-sm hover:-translate-y-1 transition-transform cursor-pointer">
                    <AvatarImage src={member.user.profilePicture} alt={member.user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {member.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              ))}
              <div className="size-10 rounded-full bg-secondary border-4 border-background flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                +{members.length > 5 ? members.length - 5 : "0"}
              </div>
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Team collaborating
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatWidget = ({ icon: Icon, label, value, color = "text-primary" }) => (
  <div className="glass p-4 rounded-2xl border border-primary/5 group hover:border-primary/20 transition-all">
    <div className="flex items-center gap-3">
      <div className={cn("p-2 rounded-xl bg-primary/5 group-hover:scale-110 transition-transform", color)}>
        <Icon className="size-4" />
      </div>
      <div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">{label}</div>
        <div className="text-xl font-black tracking-tight">{value}</div>
      </div>
    </div>
  </div>
);
