import { TIMEOUTS } from "@/src/constants/config";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface UseAuthTimeoutOptions {
  loading: boolean;
  session: Session | null;
  authError?: string | null;
  onTimeout: () => void;
  timeoutMs?: number;
  enabled?: boolean;
}

export function useAuthTimeout({
  loading,
  session,
  authError,
  onTimeout,
  timeoutMs = TIMEOUTS.AUTH_LOADING,
  enabled = true,
}: UseAuthTimeoutOptions) {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!enabled || timedOut) return;

    const timeout = setTimeout(() => {
      // Check if still loading without session or error
      const shouldTimeout = loading && !session && !authError;

      if (shouldTimeout) {
        setTimedOut(true);
        onTimeout();
      }
    }, timeoutMs);

    return () => clearTimeout(timeout);
  }, [loading, session, authError, onTimeout, timeoutMs, enabled, timedOut]);

  return timedOut;
}
