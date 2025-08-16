import * as SecureStore from "expo-secure-store";
import api from "./api";
import { useAuthStore } from "./store";
import type { AuthResponse, LoginPayload, RegisterPayload } from "./types";

export async function hydrateAuthFromStorage() {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync("accessToken"),
    SecureStore.getItemAsync("refreshToken"),
  ]);
  if (accessToken && refreshToken) {
    useAuthStore.getState().setTokens({ accessToken, refreshToken });
    try {
      const me = await api.get<AuthResponse["user"]>("/auth/profile");
      useAuthStore.getState().setUser(me.data);
    } catch {
      // ignore
    }
  }
  useAuthStore.getState().setHydrated(true);
}

export async function register(payload: RegisterPayload) {
  const res = await api.post<AuthResponse>("/auth/register", payload);
  await SecureStore.setItemAsync("accessToken", res.data.accessToken);
  await SecureStore.setItemAsync("refreshToken", res.data.refreshToken);
  useAuthStore.getState().setTokens({
    accessToken: res.data.accessToken,
    refreshToken: res.data.refreshToken,
  });
  useAuthStore.getState().setUser(res.data.user);
}

export async function loginApi(email: string, password: string) {
  const res = await api.post("auth/login", { email, password });

  return res.data;
}

export async function login(payload: LoginPayload) {
  try {
    const res = await fetch("https://booking-api.hyge.web.id/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    if (!res.ok) return false;

    const data = JSON.parse(text);

    const { accessToken, user, refreshToken } = data; // sesuaikan dengan format API

    if (!accessToken) {
      console.error("❌ Token tidak ditemukan di respons API");
      return false;
    }

    // Simpan ke SecureStore
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("user", JSON.stringify(user));
    await SecureStore.setItemAsync("refreshToken", refreshToken);

    // Update store
    useAuthStore.getState().setTokens({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
    useAuthStore.getState().setUser(user);

    console.log("✅ State setelah login:", useAuthStore.getState());
    return true;
  } catch (err) {
    console.error("Login error:", err);
    return false;
  }
}
export async function logout() {
  try {
    await api.post("https://booking-api.hyge.web.id/auth/logout");
  } catch {}
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
  useAuthStore.getState().reset();
}

export async function updateProfile(
  data: Partial<{ name: string; email: string; password: string }>
) {
  const res = await api.put<User>("/auth/profile", data);
  useAuthStore.getState().setUser(res.data);
  return res.data;
}
