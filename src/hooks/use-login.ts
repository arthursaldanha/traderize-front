import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next/client";
import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { LoginData } from "@/schemas/login-schema";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email, password }: LoginData) => {
      const {
        data: { token },
      } = await api.post("/auth/login", {
        email,
        password,
      });

      setCookie("token", token);

      return token;
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      console.error("Erro no login:", error);
    },
  });
}
