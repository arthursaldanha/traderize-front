import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { RegisterData } from "@/schemas/register-schema";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
        planId: null,
      };

      await api.post("/auth/register", payload);
    },
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error: Error) => {
      console.log("DEU ERRO AO REGISTRAR", error);
    },
  });
}
