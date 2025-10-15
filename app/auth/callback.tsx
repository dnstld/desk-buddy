import { useLocalSearchParams } from "expo-router/build/hooks";
import { router } from "expo-router/build/imperative-api";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../providers/AuthProvider";
import { TIMEOUTS } from "../../src/constants/config";
import { handleUserSignIn } from "../../src/lib/auth-service";
import { logger } from "../../src/utils/logger";

type ErrorType = "used" | "expired" | "invalid" | "generic";

interface ErrorContent {
  icon: string;
  title: string;
  message: string;
  instruction: string;
}

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams();
  const { session, loading, authError, authErrorType, clearAuthError } =
    useAuth();
  const [hasError, setHasError] = useState(false);
  const [isProcessingUser, setIsProcessingUser] = useState(false);

  // Add timeout protection for loading state
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading && !session && !authError) {
        logger.warn("Auth callback timeout - redirecting to login");
        setHasError(true);
      }
    }, TIMEOUTS.AUTH_LOADING);

    return () => clearTimeout(timeout);
  }, [loading, session, authError]);

  useEffect(() => {
    logger.debug("Auth callback screen params:", params);

    // Check for auth error from provider (this is the primary method)
    if (authError) {
      logger.info(
        "Callback screen: Found auth error from provider:",
        authError
      );
      setHasError(true);
      return;
    }

    // Wait for auth to complete, then redirect based on session status
    if (!loading) {
      if (session && !isProcessingUser) {
        // User is authenticated, handle user creation/check
        const processUser = async () => {
          setIsProcessingUser(true);
          try {
            logger.success("Auth successful, processing user...");
            const result = await handleUserSignIn();

            if (result.success) {
              logger.success("User processed successfully");
              // Redirect to rooms page
              router.replace("/(app)/rooms");
            } else {
              logger.error("Error processing user:", result.error);
              setHasError(true);
            }
          } catch (error) {
            logger.error("Error in user processing:", error);
            setHasError(true);
          } finally {
            setIsProcessingUser(false);
          }
        };

        processUser();
      } else if (!session) {
        // Give AuthProvider time to process deep link, then show error if needed
        const timeoutId = setTimeout(() => {
          if (!authError && !session) {
            logger.error(
              "No auth success after timeout, showing generic error"
            );
            setHasError(true);
          }
        }, TIMEOUTS.AUTH_ERROR_DELAY);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [session, loading, params, authError, isProcessingUser]);

  const handleRetry = () => {
    logger.info("User clicked retry, clearing errors and going to login");
    clearAuthError();
    setHasError(false);
    router.replace("/(auth)/login");
  };

  const getErrorContent = (): ErrorContent => {
    const errorType = (authErrorType || "generic") as ErrorType;

    const errorMap: Record<ErrorType, ErrorContent> = {
      used: {
        icon: "🔄",
        title: "Magic Link Already Used",
        message:
          "This magic link has already been used and is no longer valid.",
        instruction:
          "Please enter your email again to receive a new magic link.",
      },
      expired: {
        icon: "⏰",
        title: "Magic Link Expired",
        message:
          authError || "Your magic link has expired or is no longer valid.",
        instruction:
          "Please enter your email again to receive a new magic link.",
      },
      invalid: {
        icon: "❌",
        title: "Invalid Magic Link",
        message: "This magic link is not valid or has been corrupted.",
        instruction:
          "Please enter your email again to receive a new magic link.",
      },
      generic: {
        icon: "⏰",
        title: "Magic Link Issue",
        message: authError || "There was an issue with your magic link.",
        instruction:
          "Please enter your email again to receive a new magic link.",
      },
    };

    return errorMap[errorType];
  };

  // Show error screen if there's an error
  if (hasError || authError) {
    const errorContent = getErrorContent();
    logger.warn("Showing error screen:", errorContent.title);

    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-5">
        <Text className="text-5xl mb-5">{errorContent.icon}</Text>
        <Text className="text-2xl font-bold mb-4 text-red-600 text-center">
          {errorContent.title}
        </Text>
        <Text className="text-base text-gray-600 text-center mb-3 leading-6">
          {errorContent.message}
        </Text>
        <Text className="text-base text-gray-700 text-center mb-8 font-medium leading-6">
          {errorContent.instruction}
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-lg min-w-[200px]"
          onPress={handleRetry}
        >
          <Text className="text-white text-base font-semibold text-center">
            Get New Magic Link
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show loading screen while processing
  console.log("⏳ Showing loading screen while processing auth");
  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-5">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="text-2xl font-bold mt-5 mb-2.5 text-gray-800">
        Authenticating...
      </Text>
      <Text className="text-base text-gray-600 text-center">
        Please wait while we sign you in
      </Text>
    </View>
  );
}
