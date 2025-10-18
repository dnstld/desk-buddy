import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import resolveConfig from "tailwindcss/resolveConfig";
import { AuthProvider, useAuth } from "../providers/AuthProvider";
import tailwindConfig from "../tailwind.config.js";

import "../global.css";

const fullConfig = resolveConfig(tailwindConfig);
const theme = fullConfig.theme;

function RootLayoutNav() {
  const { session, loading, authError } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inAppGroup = segments[0] === "(app)";
    const isCallbackScreen =
      segments[0] === "auth" && segments[1] === "callback";

    if (isCallbackScreen) {
      return;
    }

    if (authError) {
      return;
    }

    if (session && inAuthGroup) {
      router.replace("/(app)/rooms");
    }

    if (!session && !inAuthGroup && !inAppGroup) {
      router.replace("/(auth)/login");
    }
  }, [session, loading, authError, router, segments]);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme?.colors?.blue?.[500] || "#3b82f6",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShown: false,
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="auth/callback" />
      <Stack.Screen name="index" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
