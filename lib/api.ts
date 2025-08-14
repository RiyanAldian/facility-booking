import axios, { AxiosError, AxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "./store";
import type { AuthResponse } from "./types";

export const API_BASE_URL = "https://booking-api.hyge.web.id/auth"; // <-- ganti ke base URL backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach access token on every request
api.interceptors.request.use(async (config) => {
  const tokens = useAuthStore.getState().tokens;
  if (tokens?.accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// ---- Refresh token handling (single-flight queue) ----
let isRefreshing = false;
let pendingQueue: ((token: string | null) => void)[] = [];

const processQueue = (token: string | null) => {
  pendingQueue.forEach((cb) => cb(token));
  pendingQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If unauthorized, try refresh (once)
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        // Wait for ongoing refresh
        return new Promise((resolve, reject) => {
          pendingQueue.push((newToken) => {
            if (!newToken) return reject(error);
            if (!original.headers) original.headers = {};
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshToken =
          useAuthStore.getState().tokens?.refreshToken || null;
        if (!refreshToken) throw error;

        const res = await axios.post<AuthResponse>(
          `${API_BASE_URL}/auth/refresh`,
          {
            refreshToken,
          }
        );

        const { accessToken, refreshToken: newRefresh, user } = res.data;

        // Persist & update state
        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", newRefresh);
        useAuthStore
          .getState()
          .setTokens({ accessToken, refreshToken: newRefresh });
        if (user) useAuthStore.getState().setUser(user);

        processQueue(accessToken);

        // Retry original request
        if (!original.headers) original.headers = {};
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (e) {
        processQueue(null);
        // Refresh failed → force logout
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        useAuthStore.getState().reset();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
