import { themeColors } from "@/src/constants/colors";
import { Stack } from "expo-router";

export default function RoomsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.primary,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="create/index"
        options={{
          title: "Create Room",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: "Edit Room",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="delete/[id]"
        options={{
          title: "Delete Room",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="publish/[id]"
        options={{
          title: "Publish Room",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
