import { supabase } from "@/src/lib/supabase";
import {
  getSupabaseAuthError,
  parseAuthDeepLink,
  validateAuthParams,
} from "@/src/utils/auth";
import * as Linking from "expo-linking";
import { useCallback, useEffect, useRef, useState } from "react";

export function useDeepLinkAuth() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processedUrlsRef = useRef<Set<string>>(new Set());
  const isProcessingRef = useRef(false);

  const handleDeepLink = useCallback(async (url: string) => {
    if (processedUrlsRef.current.has(url)) return;
    if (isProcessingRef.current) return;

    processedUrlsRef.current.add(url);
    isProcessingRef.current = true;
    setIsProcessing(true);
    setAuthError(null);

    try {
      const params = parseAuthDeepLink(url);

      const hasAuthParams =
        params.accessToken ||
        params.refreshToken ||
        params.error ||
        params.errorCode;

      if (!hasAuthParams) return;

      const { tokens, error: validationError } = validateAuthParams(params);

      if (validationError) {
        if (__DEV__) {
          console.error("[useDeepLinkAuth] Validation error:", validationError);
        }
        setAuthError(validationError);
        return;
      }

      if (!tokens) {
        const error = "Invalid authentication link. Please request a new one.";
        if (__DEV__) {
          console.error("[useDeepLinkAuth] No valid tokens");
        }
        setAuthError(error);
        return;
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: tokens.access,
        refresh_token: tokens.refresh,
      });

      if (sessionError) {
        const userError = getSupabaseAuthError(sessionError);
        setAuthError(userError);

        if (__DEV__) {
          console.error("[useDeepLinkAuth] Session error:", sessionError);
        }
      } else {
        setAuthError(null);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      setAuthError("Failed to process authentication link. Please try again.");

      if (__DEV__) {
        console.error("[useDeepLinkAuth] Unexpected error:", errorMessage);
      }
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        if (__DEV__) {
          console.log("[useDeepLinkAuth] Session exists, skipping initial URL processing");
        }
        return;
      }

      Linking.getInitialURL()
        .then((url) => {
          if (url && mounted) {
            handleDeepLink(url);
          }
        })
        .catch((error) => {
          if (__DEV__) {
            console.error("[useDeepLinkAuth] Failed to get initial URL:", error);
          }
        });
    });

    const subscription = Linking.addEventListener("url", ({ url }) => {
      if (mounted) {
        handleDeepLink(url);
      }
    });

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, [handleDeepLink]);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  const reset = useCallback(() => {
    setAuthError(null);
    processedUrlsRef.current.clear();
    isProcessingRef.current = false;
  }, []);

  return {
    authError,
    isProcessing,
    clearError,
    reset,
  };
}