// Import from build paths to avoid TypeScript definition issues with pnpm
import { useLocalSearchParams } from "expo-router/build/hooks";
import { router } from "expo-router/build/imperative-api";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../providers/AuthProvider";
import { handleUserSignIn } from "../../src/lib/auth-service";

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams();
  const { session, loading, authError, authErrorType, clearAuthError } =
    useAuth();
  const [hasError, setHasError] = useState(false);
  const [isProcessingUser, setIsProcessingUser] = useState(false);

  useEffect(() => {
    console.log("Auth callback screen params:", params);

    // Check for auth error from provider (this is the primary method)
    if (authError) {
      console.log(
        "✅ Callback screen: Found auth error from provider:",
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
            console.log("✅ Auth successful, processing user...");
            const result = await handleUserSignIn();

            if (result.success) {
              console.log(
                "✅ User processed successfully:",
                result.isNewUser ? "new user" : "existing user"
              );
              // Redirect to rooms page
              router.replace("/rooms");
            } else {
              console.log("❌ Error processing user:", result.error);
              setHasError(true);
            }
          } catch (error) {
            console.error("❌ Error in user processing:", error);
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
            console.log(
              "❌ No auth success after timeout, showing generic error"
            );
            setHasError(true);
          }
        }, 2000);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [session, loading, params, authError, isProcessingUser]);

  const handleRetry = () => {
    console.log("🔄 User clicked retry, clearing errors and going to login");
    clearAuthError();
    setHasError(false);
    router.replace("/(auth)/login");
  };

  const getErrorContent = () => {
    switch (authErrorType) {
      case "used":
        return {
          icon: "🔄",
          title: "Magic Link Already Used",
          message:
            "This magic link has already been used and is no longer valid.",
          instruction:
            "Please enter your email again to receive a new magic link.",
        };
      case "expired":
        return {
          icon: "⏰",
          title: "Magic Link Expired",
          message:
            authError || "Your magic link has expired or is no longer valid.",
          instruction:
            "Please enter your email again to receive a new magic link.",
        };
      case "invalid":
        return {
          icon: "❌",
          title: "Invalid Magic Link",
          message: "This magic link is not valid or has been corrupted.",
          instruction:
            "Please enter your email again to receive a new magic link.",
        };
      default:
        return {
          icon: "⏰",
          title: "Magic Link Issue",
          message: authError || "There was an issue with your magic link.",
          instruction:
            "Please enter your email again to receive a new magic link.",
        };
    }
  };

  // Show error screen if there's an error
  if (hasError || authError) {
    const errorContent = getErrorContent();
    console.log("🚨 Showing error screen:", errorContent.title);

    return (
      <View style={styles.container}>
        <Text style={styles.errorIcon}>{errorContent.icon}</Text>
        <Text style={styles.errorTitle}>{errorContent.title}</Text>
        <Text style={styles.errorMessage}>{errorContent.message}</Text>
        <Text style={styles.instructionText}>{errorContent.instruction}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Get New Magic Link</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show loading screen while processing
  console.log("⏳ Showing loading screen while processing auth");
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text style={styles.title}>Authenticating...</Text>
      <Text style={styles.subtitle}>Please wait while we sign you in</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#dc2626",
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 22,
  },
  instructionText: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    marginBottom: 32,
    fontWeight: "500",
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
