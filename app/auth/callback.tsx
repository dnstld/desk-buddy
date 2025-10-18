import Button from "@/src/components/ui/button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { router } from "expo-router/build/imperative-api";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "../../providers/AuthProvider";
import AuthPageWrapper from "../../src/components/auth-page-wrapper";
import { TIMEOUTS } from "../../src/constants/config";
import { useAuthTimeout } from "../../src/hooks/use-auth-timeout";
import { handleUserSignIn } from "../../src/lib/auth-service";
import { logger } from "../../src/utils/logger";

type ErrorType = "used" | "expired" | "invalid" | "generic";

interface ErrorContent {
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  message: string;
}

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams();
  const {
    session,
    loading,
    authError,
    authErrorType,
    clearAuthError,
    signOut,
  } = useAuth();
  const [hasError, setHasError] = useState(false);
  const [isProcessingUser, setIsProcessingUser] = useState(false);
  const hasNavigated = useRef(false);

  useAuthTimeout({
    loading,
    session,
    authError,
    onTimeout: () => {
      logger.warn("Auth callback timeout");
      setHasError(true);
    },
  });

  useEffect(() => {
    if (authError) {
      logger.info(
        "Callback screen: Found auth error from provider:",
        authError
      );
      setHasError(true);
      return;
    }

    if (!loading) {
      if (session && !isProcessingUser && !hasNavigated.current) {
        setHasError(false);

        const processUser = async () => {
          setIsProcessingUser(true);
          try {
            logger.success("Auth successful, processing user...");
            const result = await handleUserSignIn();

            if (result.success) {
              logger.success("User processed successfully");
              hasNavigated.current = true;
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
  }, [session, loading, authError, isProcessingUser, params]);

  const handleRetry = async () => {
    logger.info("User clicked retry, clearing errors and signing out");

    await signOut();

    clearAuthError();
    setHasError(false);

    router.replace("/(auth)/login");
  };

  const getErrorContent = (): ErrorContent => {
    const errorType = (authErrorType || "generic") as ErrorType;

    const errorMap: Record<ErrorType, ErrorContent> = {
      used: {
        icon: "email-open",
        title: "Magic Link Already Used",
        message: "This magic link has already been used and is no longer valid",
      },
      expired: {
        icon: "email-off",
        title: "Magic Link Expired",
        message:
          authError || "Your magic link has expired or is no longer valid",
      },
      invalid: {
        icon: "email-remove",
        title: "Invalid Magic Link",
        message: "This magic link is not valid or has been corrupted",
      },
      generic: {
        icon: "email-alert",
        title: "Magic Link Issue",
        message: authError || "There was an issue with your magic link.",
      },
    };

    return errorMap[errorType];
  };

  if (session && !loading) {
    return (
      <AuthPageWrapper>
        <View className="w-full max-w-sm gap-8">
          <ActivityIndicator size="large" color="#ffffff" />
          <View className="gap-2">
            <Text className="text-2xl font-bold text-white text-center">
              Checking your credentials
            </Text>
            <Text className="text-base text-white text-center">
              Please wait while we sign you in
            </Text>
          </View>
        </View>
      </AuthPageWrapper>
    );
  }

  if ((hasError || authError) && !session) {
    const errorContent = getErrorContent();
    logger.warn("Showing error screen:", errorContent.title);

    return (
      <AuthPageWrapper>
        <View className="w-full max-w-sm gap-8">
          <View className="items-center gap-2">
            <MaterialCommunityIcons
              name={errorContent.icon}
              size={48}
              color={hasError || authError ? "red" : "lightgreen"}
            />

            <Text className="text-2xl font-bold text-white">
              {errorContent.title}
            </Text>
          </View>

          <View className="items-center">
            <Text className="text-white text-center">
              {errorContent.message}
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
      </AuthPageWrapper>
    );
  }

  return (
    <AuthPageWrapper>
      <View className="w-full max-w-sm gap-8">
        <ActivityIndicator size="large" color="#ffffff" />
        <View className="gap-2">
          <Text className="text-2xl font-bold text-white text-center">
            Checking your credentials
          </Text>
          <Text className="text-base text-white text-center">
            Please wait while we sign you in
          </Text>
        </View>
      </View>
    </AuthPageWrapper>
  );
}
