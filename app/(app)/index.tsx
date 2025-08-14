import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../../lib/authStore";

export default function Index() {
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.replace("/facilities");
    } else {
      router.replace("/(auth)/login");
    }
  }, [token]);

  return null;
}
