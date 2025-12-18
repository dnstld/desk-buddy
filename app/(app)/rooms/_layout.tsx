import { Stack } from "expo-router";

export default function RoomsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="confirm-ownership/index"
        options={{
          title: "Confirm Ownership",
          presentation: "modal",
          headerShown: false,
        }}
      />
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
      <Stack.Screen
        name="seat/[id]"
        options={{
          title: "Edit Seat",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
