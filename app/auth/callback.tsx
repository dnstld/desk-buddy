import AppLoading from "@/src/components/app-loading";
import Button from "@/src/components/ui/button";
import { colors } from "@/src/theme/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { useAuth } from "../../providers/AuthProvider";
import CallbackPageWrapper from "../../src/components/callback-page-wrapper";
import { useHandleUserSignIn } from "../../src/hooks/use-handle-user-signin";

export default function AuthCallbackScreen() {
  const { session, isLoading: isAuthLoading, authError, signOut } = useAuth();
  const {
    mutateAsync: signInUser,
    isPending,
    error: mutationError,
    status,
    reset: resetMutation,
  } = useHandleUserSignIn();

  useEffect(() => {
    if (isAuthLoading) return;
    if (status !== "idle") return;

    if (authError && !session) {
      if (__DEV__) {
        console.error("[Callback] Auth error detected:", authError);
      }
      return;
    }

    if (session) {
      signInUser()
        .then((result) => {
          if (result.success) {
            router.replace("/(app)/rooms");
          }
        })
        .catch((err) => {
          if (__DEV__) {
            console.error("[Callback] Sign in error:", err);
          }
        });
    }
  }, [session, isAuthLoading, authError, status, signInUser]);

  const handleRetry = async () => {
    resetMutation();
    await signOut();
    router.replace("/(auth)/login");
  };

  const errorMessage = mutationError
    ? mutationError instanceof Error
      ? mutationError.message
      : "Failed to complete sign in"
    : authError;

  const hasError = !!errorMessage;

  if (hasError) {
    return (
      <CallbackPageWrapper>
        <View className="w-full max-w-sm gap-8">
          <View className="items-center gap-2">
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={64}
              color={colors.error.DEFAULT}
            />

            <Text className="text-2xl font-bold text-white text-center">
              Sign In Failed
            </Text>
          </View>

          <View className="items-center bg-white/10 rounded-lg p-4">
            <Text className="text-white text-center">
              {errorMessage || "Something went wrong"}
            </Text>
          </View>

          <Button
            title="Get New Magic Link"
            onPress={handleRetry}
            variant="primary"
            size="md"
            icon="login"
          />
        </View>
      </CallbackPageWrapper>
    );
  }

  if (isAuthLoading || isPending) {
    return <AppLoading />;
  }

  return <AppLoading />;
}
