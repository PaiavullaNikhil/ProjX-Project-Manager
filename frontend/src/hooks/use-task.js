import { fetchData, postData, updateData } from "@/lib/fetch-util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      postData(`/tasks/${data.projectId}/create-task`, data.taskData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["project", data.project],
      });
    },
  });
};

export const useTaskByIdQuery = (taskId) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchData(`/tasks/${taskId}`),
  });
};

export const useUpdateTaskTitleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      updateData(`/tasks/${data.taskId}/title`, { title: data.title }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["task", data._id || data.task] });
      queryClient.invalidateQueries({ queryKey: ["task-activity", data._id || data.task] });
      queryClient.invalidateQueries({ queryKey: ["project", data.project] });
    },
  });
};

export const useUpdateTaskStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      updateData(`/tasks/${data.taskId}/status`, { status: data.status }),
    onMutate: async (newData) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["project", newData.projectId || newData.taskId] });

      // Snapshot the previous value
      const previousProjectData = queryClient.getQueryData(["project", newData.projectId]);

      // Optimistically update to the new value
      if (previousProjectData) {
        queryClient.setQueryData(["project", newData.projectId], (old) => {
          if (!old) return old;
          return {
            ...old,
            tasks: old.tasks.map((task) =>
              task._id === newData.taskId ? { ...task, status: newData.status } : task
            ),
          };
        });
      }

      return { previousProjectData, projectId: newData.projectId };
    },
    onError: (err, newData, context) => {
      // Rollback to the previous value if mutation fails
      if (context?.previousProjectData) {
        queryClient.setQueryData(["project", context.projectId], context.previousProjectData);
      }
    },
    onSettled: (data, error, variables, context) => {
      // Always refetch after error or success to keep in sync with server
      queryClient.invalidateQueries({ queryKey: ["project", variables.projectId || data?.project] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["task", data._id] });
        queryClient.invalidateQueries({ queryKey: ["task-activity", data._id] });
      }
    },
  });
};

export const useUpdateTaskDescriptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      updateData(`/tasks/${data.taskId}/description`, {
        description: data.description,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["task", data._id || data.task] });
      queryClient.invalidateQueries({ queryKey: ["task-activity", data._id || data.task] });
      queryClient.invalidateQueries({ queryKey: ["project", data.project] });
    },
  });
};

export const useUpdateTaskAssigneesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      updateData(`/tasks/${data.taskId}/assignees`, {
        assignees: data.assignees,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["task", data._id || data.task] });
      queryClient.invalidateQueries({ queryKey: ["task-activity", data._id || data.task] });
      queryClient.invalidateQueries({ queryKey: ["project", data.project] });
    },
  });
};

export const useUpdateTaskPriorityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      updateData(`/tasks/${data.taskId}/priority`, {
        priority: data.priority,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["task", data._id || data.task] });
      queryClient.invalidateQueries({ queryKey: ["task-activity", data._id || data.task] });
      queryClient.invalidateQueries({ queryKey: ["project", data.project] });
    },
  });
};

export const useAddSubTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      postData(`/tasks/${data.taskId}/add-subtask`, { title: data.title }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["task", data._id || data.task] });
      queryClient.invalidateQueries({ queryKey: ["task-activity", data._id || data.task] });
      queryClient.invalidateQueries({ queryKey: ["project", data.project] });
    },
  });
};

export const useUpdateSubTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      updateData(`/tasks/${data.taskId}/update-subtask/${data.subTaskId}`, {
        completed: data.completed,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["task", data._id || data.task] });
      queryClient.invalidateQueries({ queryKey: ["task-activity", data._id || data.task] });
      queryClient.invalidateQueries({ queryKey: ["project", data.project] });
    },
  });
};

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      postData(`/tasks/${data.taskId}/add-comment`, { text: data.text, mentions: data.mentions }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.task] });
      queryClient.invalidateQueries({ queryKey: ["task-activity", data.task] });
      queryClient.invalidateQueries({ queryKey: ["project", data.project] });
    },
  });
};

export const useGetCommentsByTaskIdQuery = (taskId) => {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => fetchData(`/tasks/${taskId}/comments`),
  });
};

export const useWatchTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => postData(`/tasks/${data.taskId}/watch`, {}),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["task", data._id || data.task] });
      queryClient.invalidateQueries({ queryKey: ["task-activity", data._id || data.task] });
      queryClient.invalidateQueries({ queryKey: ["project", data.project] });
    },
  });
};

export const useAchievedTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => postData(`/tasks/${data.taskId}/achieved`, {}),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["task", data._id] });
      queryClient.invalidateQueries({ queryKey: ["task-activity", data._id] });
      queryClient.invalidateQueries({ queryKey: ["project", data.project] });
    },
  });
};

export const useGetMyTasksQuery = () => {
  return useQuery({
    queryKey: ["my-tasks", "user"],
    queryFn: () => fetchData("/tasks/my-tasks"),
  });
};