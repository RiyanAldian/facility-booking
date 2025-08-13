import { create } from "zustand";
import type { AuthTokens, User } from "./types";

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  hydrated: boolean; // for SecureStore hydration
  setUser: (u: User | null) => void;
  setTokens: (t: AuthTokens | null) => void;
  setHydrated: (v: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  hydrated: false,
  setUser: (user) => set({ user }),
  setTokens: (tokens) => set({ tokens }),
  setHydrated: (v) => set({ hydrated: v }),
  reset: () => set({ user: null, tokens: null }),
}));
