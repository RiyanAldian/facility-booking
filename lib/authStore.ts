import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { getProfile } from "../lib/auth";
import type { AuthTokens, User } from "./types";
interface AuthState {
  accessToken: AuthTokens | null;
  user: any | null;
  token: string | null;
  setAuth: (token: string, user: any) => Promise<void>;
  setUser: (u: User | null) => void;
  setTokens: (t: AuthTokens | null) => void;
  reset: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
  hydrateUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,

  login: async (email, password) => {
    try {
      const res = await fetch("https://booking-api.hyge.web.id/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();

      // ✅ Simpan sebagai string
      await SecureStore.setItemAsync("accessToken", data.token);
      await SecureStore.setItemAsync("user", JSON.stringify(data.user));

      // ✅ Update state
      set({ accessToken: data.token, user: data.user });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  token: null,
  setUser: (user) => set({ user }),
  setAuth: async (token, user) => {
    await SecureStore.setItemAsync("accessToken", token);
    await SecureStore.setItemAsync("token", token);
    set({ token, user });
  },
  setTokens: (accessToken) => set({ accessToken }),
  reset: () => set({ user: null, accessToken: null }),

  logout: async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("user");
    set({ accessToken: null, user: null });
  },

  restoreToken: async () => {
    const token = await SecureStore.getItemAsync("accessToken");
    const userStr = await SecureStore.getItemAsync("user");
    const user = userStr ? JSON.parse(userStr) : null;

    set({ accessToken: token, user });
  },
  hydrateUser: async () => {
    const token = await SecureStore.getItemAsync("token");
    if (!token) return;

    try {
      const user = await getProfile(token);
      set({ token, user });
    } catch {
      await SecureStore.deleteItemAsync("token");
      set({ token: null, user: null });
    }
  },
}));
