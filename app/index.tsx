import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Text, View } from "react-native";
import { useAuth } from "../providers/AuthProvider";

export default function Index() {
  const { session, loading, authError } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (!loading) {
        if (session) {
          // User is authenticated, redirect to rooms
          router.replace("/(app)/rooms" as any);
        } else if (!authError) {
          // Only redirect to login if there's no auth error pending
          // This prevents interfering with error screens
          router.replace("/(auth)/login");
        }
        // If there's an authError, let the callback screen handle it
      }
    }, [session, loading, authError])
  );

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-primary-500">Loading...</Text>
    </View>
  );
}
