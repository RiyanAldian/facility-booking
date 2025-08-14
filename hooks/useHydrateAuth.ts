import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { useAuthStore } from "../lib/authStore";

export function useHydrateAuth() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  useEffect(() => {
    async function loadAuth() {
      const token = await SecureStore.getItemAsync("token");
      const user = await SecureStore.getItemAsync("user");
      if (token && user) {
        setAuth(token, JSON.parse(user));
        router.replace("/(app)/facilities");
      } else {
        router.replace("/login");
      }
    }
    loadAuth();
  }, []);
}
