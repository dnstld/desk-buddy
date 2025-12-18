/**
 * Centralized authentication error handling
 * Maps error messages to user-friendly titles and descriptions
 */

export interface AuthErrorDisplay {
  title: string;
  message: string;
  variant?: "error" | "warning";
  waitTimeSeconds?: number;
}

/**
 * Parse authentication errors and return appropriate title and message
 * 
 * @param error - Error string from authentication flow
 * @returns Object containing title and message for display
 */
export function parseAuthError(error: string): AuthErrorDisplay {
  const lowerError = error.toLowerCase();

  // Magic link expired/timed out
  if (lowerError.includes("expired") || lowerError.includes("timed out")) {
    return {
      title: "Your link timed out",
      message: "Hmm... this link got too old. Please request a new one",
      variant: "error",
    };
  }

  // Invalid or not found link
  if (lowerError.includes("invalid") || lowerError.includes("not found")) {
    return {
      title: "Invalid link",
      message: "This magic link is invalid or has been removed. Please request a new one.",
      variant: "error",
    };
  }

  // Link already used
  if (lowerError.includes("already used") || lowerError.includes("been used")) {
    return {
      title: "Link already used",
      message: "This magic link has already been used. Please request a new one.",
      variant: "error",
    };
  }

  // Rate limiting - extract wait time if available
  if (lowerError.includes("rate limit") || lowerError.includes("too many") || lowerError.includes("can only request this after")) {
    // Try to extract seconds from error message like "after 12 seconds"
    const secondsMatch = error.match(/after (\d+) seconds?/i);
    const waitTimeSeconds = secondsMatch ? parseInt(secondsMatch[1], 10) : undefined;
    
    return {
      title: "Please wait",
      message: "For security purposes, please wait before requesting another magic link.",
      variant: "warning",
      waitTimeSeconds,
    };
  }

  // Network/connection errors
  if (lowerError.includes("network") || lowerError.includes("connection")) {
    return {
      title: "Connection error",
      message: "Unable to connect. Please check your internet connection and try again.",
      variant: "error",
    };
  }

  // Generic fallback - use the original error message
  return {
    title: "Authentication failed",
    message: error,
    variant: "error",
  };
}
