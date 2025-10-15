import { logger } from '../utils/logger';
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
    // Get the current session to get the access token
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

    // TODO: Remove in production - JWT token logging for testing only
    if (__DEV__) {
      logger.debug('JWT Token (for testing):', session.access_token.substring(0, 50) + '...');
    }
    
    logger.info('Calling edge function to handle user sign-in...');

    // Call the edge function with the user's access token
    const { data, error } = await supabase.functions.invoke<HandleUserSignInResponse>(
      'handle-user-signin',
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      },
    );

    if (error) {
      logger.error('Edge function error:', error);
      return {
        success: false,
        error: error.message || 'Edge function failed',
      };
    }

    // Check if data contains an error
    if (data && !data.success) {
      logger.error('Edge function returned error:', data);
      return data;
    }

    logger.info('Edge function response:', data);
    return data as HandleUserSignInResponse;
  } catch (error) {
    logger.error('Error in handleUserSignIn:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
