import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "../../lib/authStore";

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Redirect href="/(auth)/login" />;
  return (
    <Stack
      screenOptions={{ headerShown: false, contentStyle: { paddingTop: 50 } }}
    />
  );
}
