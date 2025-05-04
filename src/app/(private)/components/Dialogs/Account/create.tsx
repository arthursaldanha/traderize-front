/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createAccountSchema,
  CreateAccountData,
} from "@/app/(private)/components/Dialogs/Account/validations";

import {
  marketOptions,
  currencyOptions,
  platformOptions,
  brokerOptions,
} from "@/constants/Account";
import { useAccounts } from "@/contexts";
import { formatCurrency } from "@/utils/currency";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export function DialogCreateAccount({
  isOpen,
  handleOpen,
}: {
  isOpen: boolean;
  handleOpen: (open: boolean) => void;
}) {
  const form = useForm<CreateAccountData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      market: [],
      currency: undefined,
      platform: undefined,
      initialBalance: 0,
      currentBalance: 0,
      credits: 0,
      broker: "",
      brokerCustom: "",
      isPropFirm: false,
      disabled: false,
    },
  });

  const { createAccount } = useAccounts();
  const currency = form.watch("currency");

  const [initialBalance, setInitialBalance] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const [credits, setCredits] = useState("");

  const isOtherBroker = form.watch("broker") === "Outro";

  useEffect(() => {
    setInitialBalance((prev) =>
      prev ? formatCurrency(prev.replace(/\D/g, ""), currency) : ""
    );
    setCurrentBalance((prev) =>
      prev ? formatCurrency(prev.replace(/\D/g, ""), currency) : ""
    );
    setCredits((prev) =>
      prev ? formatCurrency(prev.replace(/\D/g, ""), currency) : ""
    );
  }, [currency]);

  useEffect(() => {
    const broker = form.watch("broker");
    const selected = brokerOptions.find((b) => b.value === broker);

    if (selected) {
      form.setValue("isPropFirm", selected.isPropFirm);
    }
  }, [form, form.watch("broker")]);

  const onSubmit = (data: CreateAccountData) => {
    const cleaned = {
      ...data,
      broker: data.broker === "Outro" ? data.brokerCustom : data.broker,
      initialBalance: parseFloat(initialBalance.replace(/\D/g, "")) / 100,
      currentBalance: parseFloat(currentBalance.replace(/\D/g, "")) / 100,
      credits: !!credits ? parseFloat(credits.replace(/\D/g, "")) / 100 : 0,
      disabled: data.disabled ? data.disabled : false,
    };

    console.log("cleaned ::>>", cleaned);

    createAccount(cleaned);

    onOpenChange(false);
  };

  function onOpenChange(open: boolean) {
    handleOpen(open);
    form.reset({});
    setInitialBalance("");
    setCurrentBalance("");
    setCredits("");
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar conta</DialogTitle>

          <DialogDescription>
            Preencha os dados abaixo para adicionar uma nova conta de trading.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log("Form errors:", errors);
            })}
            className="grid gap-4 py-4"
          >
            {/* Mercado */}
            <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mercado</FormLabel>
                  <div className="flex flex-col gap-2">
                    {Object.entries(marketOptions).map(([value, label]) => {
                      const isChecked = field.value?.includes(value as any);
                      const toggle = () => {
                        const updated = isChecked
                          ? field.value.filter((v: string) => v !== value)
                          : [...(field.value || []), value];
                        field.onChange(updated);
                      };

                      return (
                        <label key={value} className="flex items-center gap-2">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={toggle}
                          />
                          <span>{label}</span>
                        </label>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2">
              {/* Moeda */}
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moeda</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a moeda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(currencyOptions).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Plataforma */}
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plataforma</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a plataforma" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(platformOptions).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div
              className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2", {
                "md:grid-cols-1": !isOtherBroker,
              })}
            >
              {/* Corretora */}
              <FormField
                control={form.control}
                name="broker"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Corretora</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a corretora" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brokerOptions.map(({ value }) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Outra Corretora */}
              {isOtherBroker && (
                <FormField
                  control={form.control}
                  name="brokerCustom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Informe a corretora</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da corretora" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Mesa Proprietária */}
            {isOtherBroker && (
              <FormField
                control={form.control}
                name="isPropFirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>É mesa proprietária?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        defaultValue={String(field.value)}
                        className="flex gap-4"
                      >
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel>Sim</FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel>Não</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Saldos */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-2">
              <div className="grid gap-2">
                <FormLabel>Saldo inicial</FormLabel>
                <Input
                  placeholder="0,00"
                  value={initialBalance}
                  onChange={(e) => {
                    const formatted = formatCurrency(e.target.value, currency);
                    setInitialBalance(formatted);
                    form.setValue(
                      "initialBalance",
                      parseFloat(formatted.replace(/\D/g, "")) / 100 || 0
                    );
                  }}
                />
              </div>

              <div className="grid gap-2">
                <FormLabel>Saldo atual</FormLabel>
                <Input
                  placeholder="0,00"
                  value={currentBalance}
                  onChange={(e) => {
                    const formatted = formatCurrency(e.target.value, currency);
                    setCurrentBalance(formatted);
                    form.setValue(
                      "currentBalance",
                      parseFloat(formatted.replace(/\D/g, "")) / 100 || 0
                    );
                  }}
                />
              </div>

              <div className="grid gap-2">
                <FormLabel>Créditos</FormLabel>
                <Input
                  placeholder="0,00"
                  value={credits}
                  onChange={(e) => {
                    const formatted = formatCurrency(e.target.value, currency);
                    setCredits(formatted);
                    form.setValue(
                      "credits",
                      parseFloat(formatted.replace(/\D/g, "")) / 100 || 0
                    );
                  }}
                />
              </div>
            </div>

            {/* Firm & Desabilitada */}
            <FormField
              control={form.control}
              name="disabled"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                  </FormControl>
                  <FormLabel>Conta Desabilitada</FormLabel>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
