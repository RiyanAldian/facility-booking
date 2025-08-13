import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "../../lib/store";

export default function AppLayout() {
  const use = useAuthStore((s) => {
    console.log(s);
  });
  const user = useAuthStore((s) => s.user);

  // console.log(use);
  if (!user) return <Redirect href="/(auth)/login" />;
  return <Stack />;
}
