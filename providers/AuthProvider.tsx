import { Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import React, { createContext, useContext, useEffect, useState } from "react";

import { useToast } from "@/providers/ToastProvider";
import { useDeepLinkAuth } from "@/src/hooks";
import { supabase } from "@/src/lib/supabase";

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
  const { showError } = useToast();

  const {
    authError,
    authErrorType,
    clearAuthError,
    resetForNewEmail,
    resetAll,
  } = useDeepLinkAuth();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithOtp = async (email: string) => {
    resetForNewEmail(email);

    const redirectUrl = __DEV__
      ? Linking.createURL("/auth/callback")
      : (process.env.EXPO_PUBLIC_REDIRECT_URL || "") + "/auth/callback";

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError("Failed to sign out");
    } else {
      resetAll();
    }
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
