import { workspaceSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader } from "../../components/Loader";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import TransferWorkspaceDialog from "../../components/workspace/transfer-workspace";
import {
  useDeleteWorkspace,
  useGetWorkspaceDetailsQuery,
  useGetWorkspaceMembersQuery,
  useTransferWorkspace,
  useUpdateWorkspace,
} from "../../hooks/use-workspace";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, ShieldAlert, Users, Trash2, Save, Layout, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const colorOptions = [
  "#3b82f6", // Primary Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#1f2937", // Slate
];

const Settings = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const navigate = useNavigate();

  const { data: workspaceData, isLoading } =
    useGetWorkspaceDetailsQuery(workspaceId, {
      enabled: !!workspaceId,
    });
  const { data: membersData } = useGetWorkspaceMembersQuery(workspaceId,{
    enabled: !!workspaceId
  }) || {};

  const form = useForm({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      _id: "",
      name: "",
      color: colorOptions[0],
      description: "",
    },
  });

  const [isDialogOpen, setDialogOpen] = useState(false);

  const { mutate: updateWorkspace, isPending: isUpdating } =
    useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace();
  const { mutate: transferWorkspace, isPending: isTransferring } =
    useTransferWorkspace();

  useEffect(() => {
    if (workspaceData) {
      form.setValue("name", workspaceData.name);
      form.setValue("color", workspaceData.color || colorOptions[0]);
      form.setValue("description", workspaceData.description);
    }
  }, [workspaceData, form]);

  const onSubmit = (values) => {
    updateWorkspace(
      { ...values, workspaceId },
      {
        onSuccess: () => {
          toast.success("Workspace configuration updated");
          navigate(`/workspaces/${workspaceId}`);
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Tactical update failed");
        },
      }
    );
  };

  const handleDeleteWorkspace = () => {
    if (confirm("This action is IRREVERSIBLE. All data will be purged. Proceed?")) {
      deleteWorkspace(workspaceId, {
        onSuccess: () => {
          toast.success("Workspace decommissioned successfully");
          navigate("/workspaces");
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Decommissioning failed");
        },
      });
    }
  };

  const handleConfirmTransfer = (newOwnerId) => {
    transferWorkspace(
      { workspaceId, newOwnerId },
      {
        onSuccess: () => {
          toast.success("Ownership transfer protocol complete");
          navigate("/workspaces");
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Transfer protocol error");
        },
      }
    );
    setDialogOpen(false);
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader /></div>;

  if (!workspaceId || !workspaceData){
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-primary/10 p-10 rounded-[2.5rem] border border-primary/20 glass"
        >
          <SettingsIcon className="size-16 text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-black tracking-tight text-gradient">Configure Workspace</h2>
          <p className="text-muted-foreground mt-2 font-medium max-w-xs">Select a workspace from the sidebar to access its administrative parameters.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 max-w-4xl mx-auto">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary shadow-lg shadow-primary/5">
            <SettingsIcon className="size-5" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-gradient">System Settings</h1>
        </div>
        <p className="text-muted-foreground font-medium italic">Adjust the fundamental parameters of your '{workspaceData.name}' workspace.</p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Core Identity */}
        <Card className="glass border-primary/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <Layout className="size-4 text-primary" />
              <CardTitle className="text-xl font-black tracking-tight">Core Identity</CardTitle>
            </div>
            <CardDescription className="text-xs font-bold uppercase tracking-widest">Public profile and visual branding</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Workspace Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="glass-input h-12 rounded-xl font-bold" placeholder="Command Center X" />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tactical Mission</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          className="glass-input rounded-xl font-medium leading-relaxed resize-none"
                          placeholder="Define the primary objectives of this unit..."
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-4">
                        <Palette className="size-3 text-muted-foreground" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Visual Signal (Color)</FormLabel>
                      </div>
                      <FormControl>
                        <div className="flex gap-4 flex-wrap">
                          {colorOptions.map((color) => (
                            <motion.div
                              key={color}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => field.onChange(color)}
                              className={cn(
                                "size-8 rounded-full cursor-pointer shadow-lg transition-all duration-300 relative",
                                field.value === color && "ring-4 ring-offset-4 ring-primary shadow-primary/30"
                              )}
                              style={{ backgroundColor: color }}
                            >
                              {field.value === color && (
                                <Save className="size-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-6">
                  <Button type="submit" disabled={isUpdating} className="h-12 px-8 rounded-2xl shadow-xl shadow-primary/20 gap-3 group">
                    <Save className="size-4 group-hover:scale-125 transition-transform" />
                    <span className="font-black uppercase tracking-widest text-[10px]">{isUpdating ? "Processing..." : "Commit Changes"}</span>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Tactical Transfers */}
        <Card className="glass border-primary/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <Users className="size-4 text-primary" />
              <CardTitle className="text-xl font-black tracking-tight">Authority Transfer</CardTitle>
            </div>
            <CardDescription className="text-xs font-bold uppercase tracking-widest">Reassign ownership to a subordinate or partner</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-6">
            <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
              Transferring ownership will revoke your administrative privileges. This protocol should only be initiated after thorough personnel review.
            </p>
            <Button
              disabled={isTransferring}
              onClick={() => setDialogOpen(true)}
              variant="outline"
              className="rounded-2xl glass border-primary/10 h-12 px-6 gap-3 font-black uppercase tracking-widest text-[10px] hover:bg-primary/5"
            >
              <RefreshCw className={cn("size-4", isTransferring && "animate-spin")} />
              Initiate Transfer
            </Button>

            <TransferWorkspaceDialog
              open={isDialogOpen}
              onOpenChange={setDialogOpen}
              members={membersData?.members || []}
              onConfirm={handleConfirmTransfer}
              isTransferring={isTransferring}
            />
          </CardContent>
        </Card>

        {/* Destruction Protocol */}
        <Card className="glass border-red-500/10 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-4 bg-red-500/5">
            <div className="flex items-center gap-3 mb-1">
              <ShieldAlert className="size-4 text-red-500" />
              <CardTitle className="text-xl font-black tracking-tight text-red-500">Decommissioning</CardTitle>
            </div>
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-red-500/70">Warning: IRREVERSIBLE CRITICAL ACTION</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-6 space-y-6">
            <p className="text-sm font-bold text-red-500/70 leading-relaxed uppercase tracking-tight">
              Executing this protocol will permanently delete the workspace, all associated projects, tasks, and historical logs.
            </p>
            <Button
              disabled={isDeleting}
              onClick={handleDeleteWorkspace}
              variant="destructive"
              className="rounded-2xl h-12 px-8 gap-3 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-red-500/20"
            >
              <Trash2 className="size-4" />
              {isDeleting ? "Purging Data..." : "Purge Workspace"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const RefreshCw = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);

export default Settings;
