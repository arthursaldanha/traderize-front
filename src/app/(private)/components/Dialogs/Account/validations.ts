import { z } from "zod";

const createAccountSchema = z
  .object({
    market: z.array(z.enum(["B3", "CRYPTO", "FOREX"])),
    currency: z.enum(["AUD", "BRL", "CAD", "CHF", "CZK", "EUR", "GBP", "USD"]),
    platform: z.enum([
      "MT4",
      "MT5",
      "CTRADER",
      "DX_TRADE",
      "MATCH_TRADER",
      "TRADE_LOCKER",
      "PROFIT",
    ]),
    isPropFirm: z.boolean(),
    broker: z.string().min(2, "Broker name must be at least 2 characters long"),
    brokerCustom: z.string().optional(),
    initialBalance: z
      .number()
      .positive("Initial balance must be greater than zero"),
    currentBalance: z
      .number()
      .positive("Current balance must be greater than zero"),
    credits: z
      .number()
      .nonnegative("Credit must be equal or greater than zero")
      .optional(),
    disabled: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.broker === "Outro" && !data.brokerCustom) {
      ctx.addIssue({
        path: ["brokerCustom"],
        message: "Informe o nome da corretora",
        code: z.ZodIssueCode.custom,
      });
    }
  });

type CreateAccountData = z.infer<typeof createAccountSchema>;

export { createAccountSchema, type CreateAccountData };
