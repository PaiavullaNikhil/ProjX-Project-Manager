import { Loader } from "@/components/Loader";
import { NoDataFound } from "@/components/no-data-found";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { WorkspaceAvatar } from "@/components/workspace/workspace-avatar";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace";
import { format } from "date-fns";
import { PlusCircle, Users, ArrowRight, Layers, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const Workspaces = () => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const { data: workspaces = [], isLoading } = useGetWorkspacesQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }
  
  return (
    <>
      <div className="space-y-10 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <LayoutGrid className="size-5" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-gradient">Workspaces</h2>
            </div>
            <p className="text-muted-foreground font-medium">Manage your organizational command centers.</p>
          </div>

          <Button onClick={() => setIsCreatingWorkspace(true)} className="rounded-xl shadow-lg shadow-primary/20 h-12 px-6 group">
            <PlusCircle className="size-4 mr-2 group-hover:rotate-90 transition-transform duration-500" />
            New Workspace
          </Button>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.length > 0 ? (
            workspaces.map((ws, index) => (
              <motion.div
                key={ws._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <WorkspaceCard workspace={ws} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full">
              <NoDataFound
                title="No workspaces found"
                description="Create a new workspace to get started"
                buttonText="Create Workspace"
                buttonAction={() => setIsCreatingWorkspace(true)}
              />
            </div>
          )}
        </div>
      </div>

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </>
  );
};

const WorkspaceCard = ({ workspace }) => {
  return (
    <Link to={`/workspaces/${workspace._id}`} className="group">
      <Card className="h-full glass border-primary/5 hover:border-primary/20 transition-all duration-500 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2">
        <CardHeader className="p-8 pb-4">
          <div className="flex items-start justify-between mb-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-1 rounded-2xl bg-background shadow-xl border border-primary/5"
            >
              <WorkspaceAvatar name={workspace.name} color={workspace.color} className="size-14 rounded-xl" />
            </motion.div>

            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[9px] font-black uppercase tracking-widest px-3">
              {workspace.members.length} {workspace.members.length === 1 ? 'Member' : 'Members'}
            </Badge>
          </div>

          <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors mb-2">
            {workspace.name}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-sm font-medium leading-relaxed min-h-[40px]">
            {workspace.description || "No description provided for this organizational unit."}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8 pt-4">
          <div className="flex items-center justify-between pt-6 border-t border-primary/5">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Created</span>
              <span className="text-xs font-bold">{format(new Date(workspace.createdAt), "MMM d, yyyy")}</span>
            </div>
            
            <div className="size-10 rounded-full bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-2 group-hover:translate-x-0">
              <ArrowRight className="size-4 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Workspaces;
