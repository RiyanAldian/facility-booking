import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "./store";

export const login = async (email: string, password: string): Promise<void> => {
  const res = await fetch("https://booking-api.hyge.web.id/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    redirect: "follow",
  });

  const data = await res.json();
  const token = data.token;
  await SecureStore.setItemAsync("token", token);
  useAuthStore.getState().setUser(data.user);
};

export const logout = async (): Promise<void> => {
  await SecureStore.deleteItemAsync("token");
  useAuthStore.getState().logout();
};
