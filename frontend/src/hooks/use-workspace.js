import { fetchData, postData, updateData, deleteData, patchData } from "@/lib/fetch-util";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: async (data) => postData("/workspaces", data),
  });
};

export const useUpdateWorkspace = () => {
  return useMutation({
    mutationFn: async (data) => updateData(`/workspaces/${data.workspaceId}`, data),
  });
};

export const useDeleteWorkspace = () => {
  return useMutation({
    mutationFn: async (workspaceId) => deleteData(`/workspaces/${workspaceId}`),
  });
};

export const useTransferWorkspace = () => {
  return useMutation({
    mutationFn: async (data) => patchData(`/workspaces/${data.workspaceId}/transfer`, data),
  });
};

export const useGetWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => fetchData("/workspaces"),
  });
};

export const useGetWorkspaceMembers=(workspaceId) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "members"],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/members`),
  });
}

export const useGetWorkspaceQuery = (workspaceId) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/projects`),
  });
};

export const useGetWorkspaceStatsQuery = (workspaceId) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "stats"],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/stats`),
    enabled: !!workspaceId,
  });
};

export const useGetWorkspaceDetailsQuery = (workspaceId) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "details"],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}`),
    enabled: !!workspaceId,
  });
};

export const useGetWorkspaceActivityQuery = (workspaceId) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "activity"],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/activity`),
    enabled: !!workspaceId,
  });
};

export const useInviteMemberMutation = () => {
  return useMutation({
    mutationFn: (data) =>
      postData(`/workspaces/${data.workspaceId}/invite-member`, data),
  });
};

export const useAcceptInviteByTokenMutation = () => {
  return useMutation({
    mutationFn: (token) =>
      postData(`/workspaces/accept-invite-token`, {
        token,
      }),
  });
};

export const useAcceptGenerateInviteMutation = () => {
  return useMutation({
    mutationFn: (workspaceId) =>
      postData(`/workspaces/${workspaceId}/accept-generate-invite`, {}),
  });
};
