import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "../../lib/authStore";

export default function AuthLayout() {
  const user = useAuthStore((s) => s.user);
  if (user) return <Redirect href="/(app)/facilities" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
