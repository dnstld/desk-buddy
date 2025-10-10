import { Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../lib/supabase";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  authError: string | null;
  authErrorType: "expired" | "used" | "invalid" | null;
  signOut: () => Promise<void>;
  signInWithOtp: (email: string) => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authErrorType, setAuthErrorType] = useState<
    "expired" | "used" | "invalid" | null
  >(null);
  const [usedMagicLinks, setUsedMagicLinks] = useState<Set<string>>(new Set());
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      try {
        let accessToken: string | null = null;
        let refreshToken: string | null = null;

        if (url.includes("exp://") || url.includes("exps://")) {
          const matches = url.match(/[?&#]([^=&]+)=([^&]*)/g);
          let expiresAt: number | null = null;
          let errorCode: string | null = null;
          let errorDescription: string | null = null;

          if (matches) {
            for (const match of matches) {
              const [key, value] = match.substring(1).split("=");
              if (key === "access_token")
                accessToken = decodeURIComponent(value);
              if (key === "refresh_token")
                refreshToken = decodeURIComponent(value);
              if (key === "expires_at")
                expiresAt = parseInt(decodeURIComponent(value));
              if (key === "error_code") errorCode = decodeURIComponent(value);
              if (key === "error_description")
                errorDescription = decodeURIComponent(value);
            }
          }

          if (
            errorCode === "otp_expired" ||
            errorCode === "access_denied" ||
            errorDescription?.includes("expired") ||
            errorDescription?.includes("invalid")
          ) {
            const errorMessage =
              "Your magic link has expired. Please enter your email again to receive a new link.";
            setAuthError(errorMessage);
            setAuthErrorType("expired");
            return;
          }

          const linkId = accessToken ? accessToken.substring(0, 20) : url;
          if (linkId && usedMagicLinks.has(linkId)) {
            console.log("Detected used magic link, setting error state");
            setAuthError(
              "This magic link has already been used. Please enter your email again to receive a new link."
            );
            setAuthErrorType("used");
            return;
          }

          if (expiresAt && expiresAt < Math.floor(Date.now() / 1000)) {
            console.log(
              "Detected expired token timestamp, setting error state"
            );
            setAuthError(
              "Your magic link has expired. Please enter your email again to receive a new link."
            );
            setAuthErrorType("expired");
            return;
          }
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
                setAuthError(
                  "Your magic link has expired. Please enter your email again to receive a new link."
                );
                setAuthErrorType("expired");
              } else {
                setAuthError(`Authentication failed: ${error.message}`);
                setAuthErrorType("invalid");
              }

              Alert.alert("Authentication Error", error.message);
            } else {
              const linkId = accessToken ? accessToken.substring(0, 20) : "";
              if (linkId) {
                setUsedMagicLinks((prev) => new Set([...prev, linkId]));
              }

              setAuthError(null);
              setAuthErrorType(null);
            }
          } catch (error) {
            console.error("Error processing magic link:", error);
            setAuthError(
              "Your magic link has expired. Please enter your email again to receive a new link."
            );
            setAuthErrorType("expired");
            Alert.alert("Authentication Error", "Failed to process magic link");
          }
        } else {
          console.log("No auth tokens found in URL:", url);
        }
      } catch (error) {
        console.error("Error parsing deep link:", error);
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
  }, [usedMagicLinks]);

  const signInWithOtp = async (email: string) => {
    if (currentEmail === email) {
      setUsedMagicLinks(new Set());
      console.log("Cleared previous magic links for same email");
    }

    setCurrentEmail(email);

    // For development with Expo Go
    const redirectUrl = "exp://192.168.178.53:8081/--/auth/callback";
    console.log("Sending magic link with redirect URL:", redirectUrl);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      throw error;
    }

    console.log("Magic link sent successfully with redirect:", redirectUrl);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to sign out");
    } else {
      setUsedMagicLinks(new Set());
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
    setAuthErrorType(null);
  };

  const value: AuthContextType = {
    session,
    user: session?.user ?? null,
    loading,
    authError,
    authErrorType,
    signOut,
    signInWithOtp,
    clearAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.displayName = "AuthProvider";
