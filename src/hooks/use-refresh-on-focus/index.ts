import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

/**
 * Refetch stale queries when screen regains focus
 * Useful for keeping data fresh when navigating between screens
 * 
 * @example
 * function MyScreen() {
 *   useRefreshOnFocus(['rooms']); // Refetch rooms when screen is focused
 *   const { data } = useRoomsQuery();
 *   // ...
 * }
 */
export function useRefreshOnFocus(queryKey?: string[]) {
  const queryClient = useQueryClient();
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      // Skip the first focus (initial mount)
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      // Refetch all stale active queries matching the key
      if (queryKey) {
        queryClient.refetchQueries({
          queryKey,
          stale: true,
          type: "active",
        });
      } else {
        // Refetch all stale active queries
        queryClient.refetchQueries({
          stale: true,
          type: "active",
        });
      }
    }, [queryClient, queryKey])
  );
}
