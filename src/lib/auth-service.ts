import { supabase } from './supabase';

export interface HandleUserSignInResponse {
  success: boolean;
  user?: {
    id: string;
    company_id: string | null;
  };
  error?: string;
}

/**
 * Handle user sign-in by calling edge function to create/retrieve user and company
 * @returns Response with user data or error
 */
export async function handleUserSignIn(): Promise<HandleUserSignInResponse> {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }

    if (!session) {
      throw new Error('No active session');
    }

    if (!session.user.email) {
      throw new Error('User email not found in session');
    }

    const { data, error } = await supabase.functions.invoke<HandleUserSignInResponse>(
      'handle-user-signin',
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      },
    );

    if (error) {
      return {
        success: false,
        error: error.message || 'Edge function failed',
      };
    }

    if (data && !data.success) {
      return data;
    }

    return data as HandleUserSignInResponse;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
