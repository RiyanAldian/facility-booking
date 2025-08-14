// src/api/auth.ts
import api from "./api";

export async function loginApi(email: string, password: string) {
  const res = await api.post("login", { email, password });
  return res.data;
}

export async function getProfile(token: string) {
  const res = await api.get("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
