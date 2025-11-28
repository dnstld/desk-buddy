import {
  Inter_300Light,
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import ErrorBoundary from "@/src/components/error-boundary";

import "@/global.css";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const [loaded, error] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
    ...MaterialCommunityIcons.font,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
      <Stack.Screen options={{ presentation: "modal" }} name="(public)" />
      <Stack.Screen name="auth/callback" />
      <Stack.Screen name="index" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <StatusBar style="dark" />
      <SafeAreaProvider>
        <QueryProvider>
          <ToastProvider>
            <AuthProvider>
              <RootLayoutNav />
            </AuthProvider>
          </ToastProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
