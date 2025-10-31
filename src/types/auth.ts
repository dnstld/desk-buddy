import { AuthError } from "@supabase/supabase-js";

/**
 * Re-export Supabase's native AuthError type
 * This includes: message, status, code, and more
 */
export type { AuthError };

/**
 * Authentication state enum
 */
export enum AuthState {
  IDLE = "idle",
  LOADING = "loading",
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
  ERROR = "error",
}

/**
 * Magic link status
 */
export enum MagicLinkStatus {
  PENDING = "pending",
  SENT = "sent",
  PROCESSING = "processing",
  SUCCESS = "success",
  ERROR = "error",
}