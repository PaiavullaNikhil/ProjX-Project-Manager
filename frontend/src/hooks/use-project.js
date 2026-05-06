import { fetchData, postData, updateData, deleteData } from "@/lib/fetch-util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      return postData(`/projects/${data.workspaceId}/create-project`, data.projectData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", data.workspace],
      });
    },
  });
};

export const useProjectQuery = (projectId) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchData(`/projects/${projectId}/tasks`),
  });
};

export const useProjectActivitiesQuery = (projectId) => {
  return useQuery({
    queryKey: ["project-activities", projectId],
    queryFn: () => fetchData(`/projects/${projectId}/activities`),
  });
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, projectData }) => {
      return updateData(`/projects/${projectId}`, projectData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project", data._id] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.workspace] });
    },
  });
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId }) => {
      return deleteData(`/projects/${projectId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
    },
  });
};
