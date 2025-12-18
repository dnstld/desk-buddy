import AppLoading from "@/src/components/app-loading";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { useAuth } from "../../providers/AuthProvider";

export default function AuthCallbackScreen() {
  const { session, isLoading: isAuthLoading, authError, signOut } = useAuth();
  const processingRef = useRef(false);

  useEffect(() => {
    // Don't do anything while auth is still loading
    if (isAuthLoading) {
      return;
    }

    // Prevent concurrent processing
    if (processingRef.current) {
      return;
    }

    const handleAuthFlow = async () => {
      processingRef.current = true;

      try {
        // Handle auth errors - redirect to login with error
        if (authError) {
          await signOut();
          router.replace({
            pathname: "/(auth)/login",
            params: { error: authError },
          });
          return;
        }

        // If we have a session, redirect to root
        // The root index will handle user creation and proper routing
        if (session) {
          router.replace("/");
          return;
        }

        // No session and no error yet - wait for deep link auth to process
        processingRef.current = false; // Allow retry when session changes
      } catch {
        processingRef.current = false;
      }
    };

    handleAuthFlow();
  }, [session, isAuthLoading, authError, signOut]);

  return <AppLoading />;
}
