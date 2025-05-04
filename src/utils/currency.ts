import type { currencyOptions } from "@/constants/Account";

export const formatCurrency = (
  value: string,
  currency: keyof typeof currencyOptions
): string => {
  const digits = value.replace(/\D/g, "");
  if (digits === "") return "";

  const numericValue = parseInt(digits, 10) / 100;

  return numericValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: currency || "USD",
  });
};
