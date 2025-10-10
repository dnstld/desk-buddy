import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config.js";

import "../global.css";

const fullConfig = resolveConfig(tailwindConfig);
const theme = fullConfig.theme;

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme?.colors?.blue?.[500] || "#3b82f6",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="rooms/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="rooms/create/index"
          options={{ title: "Create Room", presentation: "modal" }}
        />
        <Stack.Screen
          name="rooms/edit/[id]"
          options={{ title: "Edit Room", presentation: "modal" }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
