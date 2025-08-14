// src/store/authStore.ts
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { getProfile } from "../lib/auth";
import type { AuthTokens, User } from "./types";

type AuthState = {
  accessToken: AuthTokens | null;
  user: any;
  token: string | null;
  setAuth: (token: string, user: any) => Promise<void>;
  setUser: (u: User | null) => void;
  setTokens: (t: AuthTokens | null) => void;
  reset: () => void;
  logout: () => Promise<void>;
  hydrateUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
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
    await SecureStore.deleteItemAsync("token");
    set({ accessToken: null, token: null, user: null });
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
