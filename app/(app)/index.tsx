import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../../lib/authStore";

export default function Index() {
  const { accessToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      router.replace("/facilities");
    } else {
      router.replace("/auth/login");
    }
  }, [accessToken]);

  return null;
}
