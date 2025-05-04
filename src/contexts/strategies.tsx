/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useCallback, useContext, useMemo } from "react";

import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/axios";

export type Strategy = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_default?: boolean;
  image_urls: string[];
  created_at: string;
  updated_at: string;
};

type StrategiesContextType = {
  strategies: Strategy[];
  isLoading: boolean;
  createStrategy: (
    input: Omit<Strategy, "id" | "created_at" | "updated_at" | "user_id">
  ) => void;
  updateStrategy: (id: string, input: Partial<Strategy>) => void;
  deleteStrategy: (id: string) => void;
};

const StrategiesContext = createContext({} as StrategiesContextType);

export const useStrategies = () => useContext(StrategiesContext);

export function StrategiesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery<Strategy[]>({
    queryKey: ["strategies"],
    queryFn: async () => {
      const response = await api.get("/api/strategies");
      return response.data;
    },
    enabled: false, // TODO REMOVE
  });

  const createMutation = useMutation({
    mutationFn: async (
      input: Omit<Strategy, "id" | "created_at" | "updated_at" | "user_id">
    ) => {
      const response = await api.post("/api/strategies", input);
      return response.data;
    },
    onSuccess: (newStrategy) => {
      queryClient.setQueryData<Strategy[]>(["strategies"], (old = []) => [
        ...old,
        newStrategy,
      ]);
      toast.success("Estratégia criada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: Partial<Strategy>;
    }) => {
      const response = await api.put(`/api/strategies/${id}`, input);
      return response.data;
    },
    onSuccess: (updatedStrategy) => {
      queryClient.setQueryData<Strategy[]>(["strategies"], (old = []) =>
        old.map((s) => (s.id === updatedStrategy.id ? updatedStrategy : s))
      );
      toast.success("Estratégia atualizada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/strategies/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Strategy[]>(["strategies"], (old = []) =>
        old.filter((s) => s.id !== id)
      );
      toast.success("Estratégia removida com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });

  const createStrategy = useCallback(
    (input: Omit<Strategy, "id" | "created_at" | "updated_at" | "user_id">) => {
      createMutation.mutate(input);
    },
    [createMutation]
  );

  const updateStrategy = useCallback(
    (id: string, input: Partial<Strategy>) => {
      updateMutation.mutate({ id, input });
    },
    [updateMutation]
  );

  const deleteStrategy = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const value = useMemo(
    () => ({
      strategies: data,
      isLoading,
      createStrategy,
      updateStrategy,
      deleteStrategy,
    }),
    [data, isLoading, createStrategy, updateStrategy, deleteStrategy]
  );

  return (
    <StrategiesContext.Provider value={value}>
      {children}
    </StrategiesContext.Provider>
  );
}
