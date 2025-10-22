import Button from "@/src/components/ui/button";
import { colors } from "@/src/theme/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router/build/imperative-api";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "../../providers/AuthProvider";
import CallbackPageWrapper from "../../src/components/callback-page-wrapper";
import { useAuthTimeout } from "../../src/hooks/use-auth-timeout";
import { handleUserSignIn } from "../../src/lib/auth-service";

type ErrorType = "used" | "expired" | "invalid" | "generic";

interface ErrorContent {
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  message: string;
}

export default function AuthCallbackScreen() {
  const {
    session,
    loading,
    authError,
    authErrorType,
    clearAuthError,
    signOut,
  } = useAuth();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const hasProcessed = useRef(false);

  useAuthTimeout({
    loading,
    session,
    authError,
    onTimeout: () => {
      setHasError(true);
      setErrorMessage("Authentication timeout. Please try again.");
    },
  });

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }

    if (loading) {
      return;
    }

    if (authError && !session) {
      setHasError(true);
      setErrorMessage(authError);
      return;
    }

    if (session) {
      hasProcessed.current = true;

      if (authError) {
        clearAuthError();
      }

      const processUser = async () => {
        try {
          const result = await handleUserSignIn();

          if (result.success) {
            router.replace("/(app)/rooms");
          } else {
            setHasError(true);
            setErrorMessage(result.error || "Failed to complete sign in");
          }
        } catch (error) {
          setHasError(true);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "An unexpected error occurred"
          );
        }
      };

      processUser();
    }
  }, [session, loading, authError, clearAuthError]);

  const handleRetry = async () => {
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
        title: "Magic link already used",
        message: "Your magic link has already been used and is no longer valid",
      },
      expired: {
        icon: "email-sync-outline",
        title: "Magic link expired",
        message: "Your magic link has expired or is no longer valid",
      },
      invalid: {
        icon: "email-sync-outline",
        title: "Invalid magic link",
        message: "Your magic link is not valid or has been corrupted",
      },
      generic: {
        icon: "email-sync-outline",
        title: "Oops! Something went wrong",
        message: "There was an issue signing you in. Please try again",
      },
    };

    return errorMap[errorType];
  };

  if (session && !loading) {
    return (
      <CallbackPageWrapper>
        <View className="w-full max-w-sm gap-8">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          <View className="gap-2">
            <Text className="text-2xl font-bold text-white text-center">
              Checking your credentials
            </Text>
            <Text className="text-base text-white text-center">
              Please wait while we sign you in
            </Text>
          </View>
        </View>
      </CallbackPageWrapper>
    );
  }

  if ((hasError || authError) && !session) {
    const errorContent = getErrorContent();

    return (
      <CallbackPageWrapper>
        <View className="w-full max-w-sm gap-8">
          <View className="items-center gap-2">
            <MaterialCommunityIcons
              name={errorContent.icon}
              size={42}
              color={colors.error.DEFAULT}
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
      </CallbackPageWrapper>
    );
  }

  return (
    <CallbackPageWrapper>
      <View className="w-full max-w-sm gap-8">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <View className="gap-2">
          <Text className="text-2xl font-bold text-white text-center">
            Checking your credentials
          </Text>
          <Text className="text-base text-white text-center">
            Please wait while we sign you in
          </Text>
        </View>
      </View>
    </CallbackPageWrapper>
  );
}
