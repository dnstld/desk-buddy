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

    // Don't redirect if we're on the callback screen (let it handle errors)
    if (isCallbackScreen) {
      return;
    }

    // Don't redirect if there's an auth error (let error screen show)
    if (authError) {
      return;
    }

    if (session && inAuthGroup) {
      // Redirect authenticated users away from auth screens to app
      router.replace("/(app)/rooms");
    } else if (!session && !inAuthGroup && !inAppGroup) {
      // Redirect unauthenticated users to auth screens
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
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
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
