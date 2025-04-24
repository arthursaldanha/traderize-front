import { z } from "zod";
import { isValidMobilePhone } from "@brazilian-utils/brazilian-utils";

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "Primeiro nome é obrigatório"),
    lastName: z.string().min(1, "Sobrenome é obrigatório"),
    username: z
      .string()
      .min(3, "Nome de usuário deve ter pelo menos 3 caracteres")
      .max(20, "Nome de usuário muito longo"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha precisa ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme sua senha"),
    phone: z
      .string()
      .min(1, "Telefone é obrigatório")
      .refine(
        (phone) => {
          const cleanPhone = phone.replace(/\D/g, "");
          return isValidMobilePhone(cleanPhone);
        },
        { message: "Telefone inválido" }
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterData = z.infer<typeof registerSchema>;
