/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useCallback, useMemo } from "react";

import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/axios";

export type Journal = {
  id: string;
  account_id: string;
  strategy_id?: string;
  asset: string;
  entry_price: number;
  stop_price: number;
  take_prices: number[];
  investment: number;
  lots: number;
  result?: number;
  risk_reward_ratio?: number;
  image_urls: string[];
  status: string;
  direction: string;
  trade_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

interface JournalsContextType {
  journals: Journal[];
  isLoading: boolean;
  createJournal: (
    input: Omit<Journal, "id" | "created_at" | "updated_at">
  ) => void;
  updateJournal: (id: string, input: Partial<Journal>) => void;
  deleteJournal: (id: string) => void;
}

const JournalsContext = createContext<JournalsContextType | null>(null);

export const useJournals = () => {
  const context = useContext(JournalsContext);
  if (!context)
    throw new Error("useJournals must be used within JournalsProvider");
  return context;
};

export const JournalsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryClient = useQueryClient();

  const { data: journals = [], isLoading } = useQuery<Journal[]>({
    queryKey: ["journals"],
    queryFn: async () => {
      const { data } = await api.get("/journals");
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (
      input: Omit<Journal, "id" | "created_at" | "updated_at">
    ) => {
      const { data } = await api.post("/journals", input);
      return data;
    },
    onSuccess: (newJournal) => {
      queryClient.setQueryData<Journal[]>(["journals"], (old = []) => [
        ...old,
        newJournal,
      ]);
      toast.success("Jornal criado com sucesso!");
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Erro ao criar jornal"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: Partial<Journal>;
    }) => {
      const { data } = await api.put(`/journals/${id}`, input);
      return data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Journal[]>(["journals"], (old = []) =>
        old.map((j) => (j.id === updated.id ? updated : j))
      );
      toast.success("Jornal atualizado!");
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Erro ao atualizar jornal"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/journals/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Journal[]>(["journals"], (old = []) =>
        old.filter((j) => j.id !== id)
      );
      toast.success("Jornal deletado!");
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Erro ao deletar jornal"),
  });

  const createJournal = useCallback(
    (input: Omit<Journal, "id" | "created_at" | "updated_at">) =>
      createMutation.mutate(input),
    [createMutation]
  );

  const updateJournal = useCallback(
    (id: string, input: Partial<Journal>) =>
      updateMutation.mutate({ id, input }),
    [updateMutation]
  );

  const deleteJournal = useCallback(
    (id: string) => deleteMutation.mutate(id),
    [deleteMutation]
  );

  const value = useMemo(
    () => ({
      journals,
      isLoading,
      createJournal,
      updateJournal,
      deleteJournal,
    }),
    [journals, isLoading, createJournal, updateJournal, deleteJournal]
  );

  return (
    <JournalsContext.Provider value={value}>
      {children}
    </JournalsContext.Provider>
  );
};
