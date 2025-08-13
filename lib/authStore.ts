import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  user: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
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
}));
