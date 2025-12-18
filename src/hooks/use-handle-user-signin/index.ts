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
    onSuccess: async (data: SignInResult) => {
      if (data.success && data.user && authUser) {
        // Invalidate all user-related queries to force a refetch
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        
        // Invalidate users list query if company_id is available
        if (data.user.company_id) {
          await queryClient.invalidateQueries({ 
            queryKey: ["users", data.user.company_id] 
          });
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

    if (error) {
      if (__DEV__) {
        console.error("[handleUserSignIn] Edge function error:", error);
      }
      return {
        success: false,
        error: error.message ?? "Failed to complete sign in",
      };
    }

    if (!data?.success) {
      if (__DEV__) {
        console.error("[handleUserSignIn] Sign in failed:", data?.error);
      }
      return {
        success: false,
        error: data?.error ?? "Failed to complete sign in",
      };
    }

    if (!data.user) {
      if (__DEV__) {
        console.error("[handleUserSignIn] User data missing in response");
      }
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
