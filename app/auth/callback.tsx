import AppLoading from "@/src/components/app-loading";
import { router } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { useHandleUserSignIn } from "../../src/hooks/use-handle-user-signin";

export default function AuthCallbackScreen() {
  const { session, isLoading: isAuthLoading, authError, signOut } = useAuth();
  const {
    mutateAsync: signInUser,
    error: mutationError,
    status,
    reset: resetMutation,
  } = useHandleUserSignIn();

  useEffect(() => {
    if (isAuthLoading) return;
    if (status !== "idle") return;

    const handleAuthFlow = async () => {
      // Handle auth errors - redirect to login with error
      if (authError && !session) {
        if (__DEV__) {
          console.error("[Callback] Auth error detected:", authError);
        }
        await signOut();
        router.replace({
          pathname: "/(auth)/login",
          params: { error: authError },
        });
        return;
      }

      // Handle successful session - attempt sign in
      if (session) {
        try {
          const result = await signInUser();
          if (result.success) {
            router.replace("/(app)/rooms");
          }
        } catch (err) {
          if (__DEV__) {
            console.error("[Callback] Sign in error:", err);
          }
          const errorMessage =
            err instanceof Error ? err.message : "Failed to complete sign in";
          await signOut();
          router.replace({
            pathname: "/(auth)/login",
            params: { error: errorMessage },
          });
        }
      }
    };

    handleAuthFlow();
  }, [session, isAuthLoading, authError, status, signInUser, signOut]);

  // Handle mutation errors after they occur
  useEffect(() => {
    if (mutationError) {
      const errorMessage =
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to complete sign in";

      if (__DEV__) {
        console.error("[Callback] Mutation error:", mutationError);
      }

      const redirectWithError = async () => {
        resetMutation();
        await signOut();
        router.replace({
          pathname: "/(auth)/login",
          params: { error: errorMessage },
        });
      };

      redirectWithError();
    }
  }, [mutationError, resetMutation, signOut]);

  return <AppLoading />;
}
