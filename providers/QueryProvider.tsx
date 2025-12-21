import { logger } from "@/src/shared/utils/logger";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import * as Network from "expo-network";
import { ReactNode, useEffect } from "react";
import type { AppStateStatus } from "react-native";
import { AppState, Platform } from "react-native";

const queryClient = new QueryClient();

// Online status management
onlineManager.setEventListener((setOnline) => {
  logger.debug("[QueryProvider] Online status management");
  const eventSubscription = Network.addNetworkStateListener(
    (state: Network.NetworkState) => {
      setOnline(!!state.isConnected);
    }
  );
  return eventSubscription.remove;
});

// Refetch on App focus
function onAppStateChange(status: AppStateStatus) {
  logger.debug("[QueryProvider] Refetch on App focus:", status);
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

export function QueryProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export { queryClient };
