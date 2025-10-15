import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { TIMEOUTS } from "../src/constants/config";
import { logger } from "../src/utils/logger";

export default function Index() {
  const { session, loading, authError } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  // Add timeout protection
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading && !session) {
        logger.warn("Auth loading timeout - redirecting to login");
        setTimedOut(true);
        router.replace("/(auth)/login");
      }
    }, TIMEOUTS.AUTH_LOADING);

    return () => clearTimeout(timeout);
  }, [loading, session]);

  useFocusEffect(
    useCallback(() => {
      if (!loading && !timedOut) {
        if (session) {
          // User is authenticated, redirect to rooms
          router.replace("/(app)/rooms");
        } else if (!authError) {
          // Only redirect to login if there's no auth error pending
          // This prevents interfering with error screens
          router.replace("/(auth)/login");
        }
        // If there's an authError, let the callback screen handle it
      }
    }, [session, loading, authError, timedOut])
  );

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-primary-500">Loading...</Text>
    </View>
  );
}
