"use client";

import { apiService } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "./api/types";

export interface Group {
  id: string;
  groupName: string;
  parentId?: string;
  path: string;
  level: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupBody {
  groupName: string;
  parentId?: string;
}

export interface UpdateGroupBody {
  groupName?: string;
  parentId?: string;
}

const GROUP_ENDPOINTS = {
  GROUPS: "/groups",
  GROUP: (id: string) => `/groups/${id}`,
};

export const GroupService = {
  // Get all groups
  getGroups: () => {
    return apiService.get<ApiResponse<Group[]>>(GROUP_ENDPOINTS.GROUPS);
  },

  // Get group by ID
  getGroup: (id: string) => {
    return apiService.get<ApiResponse<Group>>(GROUP_ENDPOINTS.GROUP(id));
  },

  // Create group
  createGroup: (data: CreateGroupBody) => {
    return apiService.post<ApiResponse<Group>>(GROUP_ENDPOINTS.GROUPS, data);
  },

  // Update group
  updateGroup: (id: string, data: UpdateGroupBody) => {
    return apiService.put<ApiResponse<Group>>(GROUP_ENDPOINTS.GROUP(id), data);
  },

  // Delete group
  deleteGroup: (id: string) => {
    return apiService.delete<ApiResponse<void>>(GROUP_ENDPOINTS.GROUP(id));
  },
};

// React Query hooks
export const useGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: () => GroupService.getGroups(),
  });
};

export const useGroup = (id: string) => {
  return useQuery({
    queryKey: ["group", id],
    queryFn: () => GroupService.getGroup(id),
    enabled: !!id,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroupBody) => GroupService.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGroupBody }) =>
      GroupService.updateGroup(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["group", variables.id] });
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => GroupService.deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};
