/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useCallback, useMemo } from "react";

import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/axios";

export type Account = {
  id: string;
  market: string[];
  currency: string;
  platform: string;
  isPropFirm: boolean;
  broker: string;
  initialBalance: number;
  currentBalance: number;
  floatingBalance: number;
  credits: number | null;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
};

type AccountsContextType = {
  accounts: Account[];
  createAccount: (input: Partial<Account>) => void;
  updateAccount: (id: string, input: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
};

const AccountsContext = createContext<AccountsContextType | null>(null);

export function useAccounts() {
  const context = useContext(AccountsContext);
  if (!context)
    throw new Error("useAccounts must be used within AccountsProvider");
  return context;
}

export function AccountsProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: accounts = [] } = useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data } = await api.get("/accounts");
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (input: Partial<Account>) => {
      const { data } = await api.post("/accounts", input);
      return data;
    },
    onSuccess: (newAccount) => {
      queryClient.setQueryData<Account[]>(["accounts"], (prev = []) => [
        ...prev,
        newAccount,
      ]);
      toast.success("Conta criada com sucesso!");
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Erro ao criar conta"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: Partial<Account>;
    }) => {
      const { data } = await api.put(`/accounts/${id}`, input);
      return data;
    },
    onSuccess: (updatedAccount) => {
      queryClient.setQueryData<Account[]>(["accounts"], (prev = []) =>
        prev.map((a) => (a.id === updatedAccount.id ? updatedAccount : a))
      );
      toast.success("Conta atualizada com sucesso!");
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Erro ao atualizar conta"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/accounts/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Account[]>(["accounts"], (prev = []) =>
        prev.filter((a) => a.id !== id)
      );
      toast.success("Conta deletada com sucesso!");
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Erro ao deletar conta"),
  });

  const createAccount = useCallback(
    (input: Partial<Account>) => createMutation.mutate(input),
    [createMutation]
  );

  const updateAccount = useCallback(
    (id: string, input: Partial<Account>) =>
      updateMutation.mutate({ id, input }),
    [updateMutation]
  );

  const deleteAccount = useCallback(
    (id: string) => deleteMutation.mutate(id),
    [deleteMutation]
  );

  const value = useMemo(
    () => ({
      accounts,
      createAccount,
      updateAccount,
      deleteAccount,
    }),
    [accounts, createAccount, updateAccount, deleteAccount]
  );

  return (
    <AccountsContext.Provider value={value}>
      {children}
    </AccountsContext.Provider>
  );
}
