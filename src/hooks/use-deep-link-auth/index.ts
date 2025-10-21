import { supabase } from "@/src/lib/supabase";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { Alert } from "react-native";
import { useMagicLinkTracker } from "../use-magic-link-tracker";

interface DeepLinkParams {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  errorCode: string | null;
  errorDescription: string | null;
}

function parseDeepLinkUrl(url: string): DeepLinkParams {
  let accessToken: string | null = null;
  let refreshToken: string | null = null;
  let expiresAt: number | null = null;
  let errorCode: string | null = null;
  let errorDescription: string | null = null;

  if (__DEV__) {
    // Manual parsing for Expo development URLs (exp:// or exps://)
    const matches = url.match(/[?&#]([^=&]+)=([^&]*)/g);

    if (matches) {
      for (const match of matches) {
        const [key, value] = match.substring(1).split("=");
        if (key === "access_token") accessToken = decodeURIComponent(value);
        if (key === "refresh_token") refreshToken = decodeURIComponent(value);
        if (key === "expires_at")
          expiresAt = parseInt(decodeURIComponent(value));
        if (key === "error_code") errorCode = decodeURIComponent(value);
        if (key === "error_description")
          errorDescription = decodeURIComponent(value);
      }
    }
  } else {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    accessToken = params.get("access_token");
    refreshToken = params.get("refresh_token");

    const expiresAtStr = params.get("expires_at");
    expiresAt = expiresAtStr ? parseInt(expiresAtStr) : null;

    errorCode = params.get("error_code");
    errorDescription = params.get("error_description");
  }

  return { accessToken, refreshToken, expiresAt, errorCode, errorDescription };
}

export function useDeepLinkAuth() {
  const tracker = useMagicLinkTracker();

  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      try {
        const { accessToken, refreshToken, expiresAt, errorCode, errorDescription } =
          parseDeepLinkUrl(url);

        if (
          errorCode === "otp_expired" ||
          errorCode === "access_denied" ||
          errorDescription?.includes("expired") ||
          errorDescription?.includes("invalid")
        ) {
          tracker.setExpiredError();
          return;
        }

        const linkId = accessToken ? accessToken.substring(0, 20) : url;
        if (linkId && tracker.isLinkUsed(linkId)) {
          tracker.setUsedError();
          return;
        }

        if (tracker.isLinkExpired(expiresAt)) {
          tracker.setExpiredError();
          return;
        }

        if (accessToken && refreshToken) {
          try {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              if (
                error.message.includes("expired") ||
                error.message.includes("invalid") ||
                error.message.includes("JWT") ||
                error.status === 401
              ) {
                tracker.setExpiredError();
              } else {
                tracker.setInvalidError(`Authentication failed: ${error.message}`);
              }

              Alert.alert("Authentication Error", error.message);
            } else {
              const linkId = accessToken.substring(0, 20);
              if (linkId) {
                tracker.markLinkAsUsed(linkId);
              }
              tracker.clearError();
            }
          } catch {
            tracker.setExpiredError();
            Alert.alert("Authentication Error", "Failed to process magic link");
          }
        }
      } catch {
        tracker.setInvalidError();
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription?.remove();
  }, [tracker]);

  return {
    authError: tracker.error.message || null,
    authErrorType: tracker.error.type,
    clearAuthError: tracker.clearError,
    resetForNewEmail: tracker.resetForNewEmail,
    resetAll: tracker.resetAll,
  };
}
