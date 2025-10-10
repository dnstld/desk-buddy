import { Stack, useRouter, useSegments } from "expo-router";
import { useCallback, useEffect } from "react";
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

  const handleAuthRedirect = useCallback(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inAppGroup = segments[0] === "(app)";
    const inCallbackScreen =
      segments[0] === "auth" && segments[1] === "callback";

    // Don't redirect if we're on the callback screen (let it handle errors)
    if (inCallbackScreen) {
      console.log("📍 Layout: On callback screen, skipping redirect");
      return;
    }

    // Don't redirect if there's an auth error (let error screen show)
    if (authError) {
      console.log("📍 Layout: Auth error present, skipping redirect");
      return;
    }

    if (session && inAuthGroup) {
      // Redirect authenticated users away from auth screens to rooms
      console.log("📍 Layout: Redirecting authenticated user to rooms");
      router.replace("/(app)/" as any);
    } else if (!session && !inAuthGroup && !inAppGroup) {
      // Redirect unauthenticated users to auth screens
      console.log("📍 Layout: Redirecting unauthenticated user to login");
      router.replace("/(auth)/login");
    }
  }, [session, loading, segments, router, authError]);

  useEffect(() => {
    handleAuthRedirect();
  }, [handleAuthRedirect]);

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
