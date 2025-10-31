import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/src/lib/supabase";
import { User } from "@/src/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface BaseResponse {
  success: boolean;
  error?: string;
}

export interface SignInResult extends BaseResponse {
  user?: User;
}

export function useHandleUserSignIn() {
  const queryClient = useQueryClient();
  const { user: authUser } = useAuth();

  return useMutation({
    mutationFn: handleUserSignIn,
    onSuccess: (data: SignInResult) => {
      if (data.success && data.user && authUser) {
        queryClient.setQueryData<User>(["user", authUser.id], data.user);

        if (__DEV__) {
          console.log("[useHandleUserSignIn] User data cached:", data.user);
          console.log("[useHandleUserSignIn] Cache key:", [
            "user",
            authUser.id,
          ]);
        }
      }
    },
    onError: (error) => {
      if (__DEV__) {
        console.error("[useHandleUserSignIn] Mutation error:", error);
      }
    },
  });
}

async function handleUserSignIn(): Promise<SignInResult> {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return {
        success: false,
        error: "Session not available. Please sign in again.",
      };
    }

    const { data, error } = await supabase.functions.invoke<SignInResult>(
      "handle-user-signin"
    );

    if (error || !data?.success) {
      return {
        success: false,
        error: data?.error ?? error?.message ?? "Failed to complete sign in",
      };
    }

    if (!data.user) {
      return { success: false, error: "User data missing in response" };
    }

    return { success: true, user: data.user };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}
