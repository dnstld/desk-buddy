/**
 * Error handling utilities for consistent error handling across the application
 */

/**
 * Extracts a user-friendly error message from various error types
 * @param error - The error to extract the message from
 * @param fallback - Fallback message if error message cannot be extracted
 * @returns A user-friendly error message
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle Supabase errors
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return fallback;
};

/**
 * Type guard to check if an error is an Error instance
 */
export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

/**
 * Checks if an error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (!isError(error)) return false;
  
  const message = error.message.toLowerCase();
  return (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('connection')
  );
};

/**
 * Checks if an error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (!isError(error)) return false;
  
  const message = error.message.toLowerCase();
  return (
    message.includes('auth') ||
    message.includes('unauthorized') ||
    message.includes('session') ||
    message.includes('token')
  );
};
