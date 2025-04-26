"use client";

import { apiService } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface User {
  id: string;
  email?: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UserCreateData {
  email: string;
  name: string;
  password: string;
  role: string;
}

interface UserUpdateData {
  name?: string;
  role?: string;
}

const USER_ENDPOINTS = {
  USERS: "/users",
  USER: (id: string) => `/users/${id}`,
};

export const UserService = {
  // Get all users
  getUsers: () => {
    return apiService.get<User[]>(USER_ENDPOINTS.USERS);
  },

  // Get user by ID
  getUser: (id: string) => {
    return apiService.get<User>(USER_ENDPOINTS.USER(id));
  },

  // Create user
  createUser: (data: UserCreateData) => {
    return apiService.post<User>(USER_ENDPOINTS.USERS, data);
  },

  // Update user
  updateUser: (id: string, data: UserUpdateData) => {
    return apiService.patch<User>(USER_ENDPOINTS.USER(id), data);
  },

  // Delete user
  deleteUser: (id: string) => {
    return apiService.delete(USER_ENDPOINTS.USER(id));
  },
};

// React Query hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => UserService.getUsers(),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => UserService.getUser(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserCreateData) => UserService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserUpdateData }) =>
      UserService.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UserService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
