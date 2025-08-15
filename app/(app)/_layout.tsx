import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "../../lib/authStore";

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);

  console.log(user, "ww");
  if (!user) return <Redirect href="/(auth)/login" />;
  return <Stack />;
}
