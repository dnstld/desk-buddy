import { AuthError } from "@/src/types/auth";

/**
 * Authentication parameters extracted from deep link URLs
 */
export interface AuthParams {
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
  errorCode: string | null;
}

/**
 * Parsed authentication parameters with validation
 */
export interface ParsedAuthParams {
  tokens: {
    access: string;
    refresh: string;
  } | null;
  error: string | null;
}

/**
 * Parse authentication parameters from a deep link URL.
 * Supabase auth callbacks use hash fragments (#) not query strings (?).
 * 
 * @param url - The deep link URL to parse
 * @returns Parsed authentication parameters
 */
export function parseAuthDeepLink(url: string): AuthParams {
  try {
    // Supabase magic links use hash fragments, not query params
    // Example: exp://host/path#access_token=xxx&refresh_token=yyy
    const hashIndex = url.indexOf('#');
    
    if (hashIndex === -1) {
      return {
        accessToken: null,
        refreshToken: null,
        error: null,
        errorCode: null,
      };
    }

    // Extract hash fragment and parse as URL search params
    const hashFragment = url.substring(hashIndex + 1);
    const params = new URLSearchParams(hashFragment);

    return {
      accessToken: params.get('access_token'),
      refreshToken: params.get('refresh_token'),
      error: params.get('error_description'),
      errorCode: params.get('error_code'),
    };
  } catch {
    return {
      accessToken: null,
      refreshToken: null,
      error: "Failed to parse authentication link",
      errorCode: null,
    };
  }
}

/**
 * Validate and normalize auth parameters.
 * Returns either valid tokens or a user-friendly error message.
 * 
 * @param params - Raw auth parameters from URL
 * @returns Validated tokens or error
 */
export function validateAuthParams(params: AuthParams): ParsedAuthParams {
  // Check for explicit errors from the auth provider
  if (params.error || params.errorCode) {
    return {
      tokens: null,
      error: getAuthErrorMessage(params.error, params.errorCode),
    };
  }

  // Validate required tokens
  if (!params.accessToken || !params.refreshToken) {
    return {
      tokens: null,
      error: "Invalid authentication link. Please request a new one.",
    };
  }

  return {
    tokens: {
      access: params.accessToken,
      refresh: params.refreshToken,
    },
    error: null,
  };
}

/**
 * Convert Supabase auth errors into user-friendly messages.
 * Maps technical errors to clear, actionable messages for users.
 * 
 * @param error - Supabase auth error
 * @returns User-friendly error message
 */
export function getSupabaseAuthError(error: AuthError): string {
  const message = error.message?.toLowerCase() || "";
  const status = error.status;

  // Expired token errors
  if (
    message.includes("expired") ||
    message.includes("jwt") ||
    status === 401
  ) {
    return "Your magic link has expired. Please request a new one.";
  }

  // Invalid token errors
  if (message.includes("invalid") || message.includes("malformed")) {
    return "This magic link is invalid. Please request a new one.";
  }

  // Network errors
  if (message.includes("network") || message.includes("fetch")) {
    return "Network error. Please check your connection and try again.";
  }

  // Rate limiting
  if (status === 429) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  // Generic fallback
  return "Authentication failed. Please try again.";
}

/**
 * Get user-friendly error message from auth provider errors.
 * 
 * @param errorDescription - Error description from URL
 * @param errorCode - Error code from URL
 * @returns User-friendly error message
 */
function getAuthErrorMessage(
  errorDescription: string | null,
  errorCode: string | null
): string {
  if (errorCode === "otp_expired" || errorDescription?.includes("expired")) {
    return "Your magic link has expired. Please request a new one.";
  }

  if (errorCode === "access_denied") {
    return "Access denied. Please request a new magic link.";
  }

  if (errorDescription?.includes("invalid")) {
    return "Invalid magic link. Please request a new one.";
  }

  return errorDescription || "Authentication failed. Please try again.";
}

/**
 * Normalize email address for consistent storage and comparison.
 * 
 * @param email - Email address to normalize
 * @returns Normalized email address
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Validate email format.
 * 
 * @param email - Email address to validate
 * @returns True if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}