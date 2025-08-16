// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Stack } from "expo-router";
// import { useEffect } from "react";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { useAuthStore } from "../lib/store";

// const queryClient = new QueryClient();

// export default function RootLayout() {
//   const restoreToken = useAuthStore((s) => s.restoreToken);
//   const hydrated = useAuthStore((s) => s.hydrated);
//   const setHydrated = useAuthStore((s) => s.setHydrated);

//   useEffect(() => {
//     (async () => {
//       await restoreToken();
//       setHydrated(true);
//     })();
//   }, []);
//   return (
//     <SafeAreaProvider>
//       <QueryClientProvider client={queryClient}>
//         <Stack screenOptions={{ headerShown: false }} />
//       </QueryClientProvider>
//     </SafeAreaProvider>
//   );
// }

// src/app/_layout.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "../lib/authStore";

const queryClient = new QueryClient();

export default function RootLayout() {
  const hydrateUser = useAuthStore((s) => s.hydrateUser);
  const token = useAuthStore((s) => s.token);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await hydrateUser();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (token) {
        router.replace("/(tabs)/index");
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [loading, token]);

  if (loading) {
    return null;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}
