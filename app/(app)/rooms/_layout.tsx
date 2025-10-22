import { colors } from "@/src/theme/colors";
import { Stack } from "expo-router";

export default function RoomsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.DEFAULT,
        },
        headerTintColor: colors.gray[50],
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
