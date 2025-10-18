import AuthPageWrapper from "@/src/components/auth-page-wrapper";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { useAuthTimeout } from "../src/hooks/use-auth-timeout";

export default function Index() {
  const { session, loading } = useAuth();
  const hasNavigated = useRef(false);

  const timedOut = useAuthTimeout({
    loading,
    session,
    onTimeout: () => {
      hasNavigated.current = true;
      router.replace("/(auth)/login");
    },
    enabled: !hasNavigated.current,
  });

  useFocusEffect(
    useCallback(() => {
      if (loading || timedOut || hasNavigated.current) return;

      hasNavigated.current = true;

      if (session) {
        router.replace("/(app)/rooms");
      } else {
        router.replace("/(auth)/login");
      }
    }, [session, loading, timedOut])
  );

  return (
    <AuthPageWrapper>
      <View className="w-full max-w-sm gap-8">
        <ActivityIndicator size="large" color="#ffffff" />
        <View className="gap-2">
          <Text className="text-2xl font-bold text-white text-center">
            Hey buddy!
          </Text>
          <Text className="text-base text-white text-center">
            We are setting things up for you
          </Text>
        </View>
      </View>
    </AuthPageWrapper>
  );
}
