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
        name="seat/[id]"
        options={{
          title: "Edit Seat",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
