import { useDeepLinkAuth } from "@/src/components/features/auth/hooks/use-deep-link-auth";
import { supabase } from "@/src/lib/supabase";
import { useStorage } from "@/src/shared/hooks/use-storage";
import { normalizeEmail } from "@/src/shared/utils/auth";
import { Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;

  authError: string | null;
  isAuthenticating: boolean;

  isSigningIn: boolean;
  isSigningOut: boolean;
  signInError: string | null;

  signInWithOtp: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
  clearSignInError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

const REDIRECT_URL = __DEV__ ? null : process.env.EXPO_PUBLIC_REDIRECT_URL;

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const { removeItem } = useStorage();

  const {
    authError,
    isProcessing: isAuthenticating,
    clearError: clearAuthError,
    reset: resetDeepLinkAuth,
  } = useDeepLinkAuth();

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error("[AuthProvider] Error getting session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithOtp = useCallback(
    async (email: string) => {
      setIsSigningIn(true);
      setSignInError(null);

      try {
        const normalizedEmail = normalizeEmail(email);

        // Sign out any existing session first to prevent sending magic link to wrong email
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          await supabase.auth.signOut();
          // Clear stored email
          await removeItem("email");
        }

        const redirectUrl = __DEV__
          ? Linking.createURL("/auth/callback")
          : `${REDIRECT_URL}/auth/callback`;

        const { error } = await supabase.auth.signInWithOtp({
          email: normalizedEmail,
          options: {
            emailRedirectTo: redirectUrl,
            shouldCreateUser: true,
          },
        });

        if (error) {
          setSignInError(error.message);
          throw error;
        }
      } finally {
        setIsSigningIn(false);
      }
    },
    [removeItem]
  );

  const signOut = useCallback(async () => {
    setIsSigningOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Clear stored email when signing out
      await removeItem("email");

      resetDeepLinkAuth();
    } finally {
      setIsSigningOut(false);
    }
  }, [resetDeepLinkAuth, removeItem]);

  const clearSignInError = useCallback(() => {
    setSignInError(null);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  // Callback functions (signInWithOtp, signOut, clearAuthError, clearSignInError)
  // are already stable via useCallback, so they don't need to be in dependencies.
  // This intentionally omits callbacks to prevent unnecessary re-renders.
  const value = useMemo<AuthContextType>(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      authError,
      isAuthenticating,
      isSigningIn,
      isSigningOut,
      signInError,
      signInWithOtp,
      signOut,
      clearAuthError,
      clearSignInError,
    }),
    // Intentionally omitting stable callback functions from dependencies
    // to prevent unnecessary context re-renders across the entire app
    [
      session,
      isLoading,
      authError,
      isAuthenticating,
      isSigningIn,
      isSigningOut,
      signInError,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
