import { useState } from "react";
import { Edit, Save, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUpdateTaskDescriptionMutation } from "@/hooks/use-task";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export const TaskDescription = ({ description, taskId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(description);
  const { mutate, isPending } = useUpdateTaskDescriptionMutation();

  const updateDescription = () => {
    mutate(
      { taskId, description: newDescription },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Description updated successfully");
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Update failed");
        },
      }
    );
  };

  return (
    <div className="group relative">
      {isEditing ? (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <Textarea
            className="w-full min-h-[120px] rounded-2xl glass border-primary/10 focus:ring-primary/20 p-4 font-medium text-sm leading-relaxed shadow-inner"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            disabled={isPending}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
              onClick={() => {
                setIsEditing(false);
                setNewDescription(description);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-9 px-6 rounded-xl bg-primary shadow-lg shadow-primary/20 text-[10px] font-black uppercase tracking-widest gap-2"
              onClick={updateDescription}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <>
                  <Save className="size-3" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div 
            className="text-sm md:text-base text-pretty text-muted-foreground font-medium leading-relaxed p-4 rounded-2xl border border-transparent group-hover:border-primary/5 group-hover:bg-primary/[0.02] transition-all cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {description || "No description provided for this task."}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit className="size-4 text-primary" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
