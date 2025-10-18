import { Stack } from "expo-router";

export default function RoomsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "modal",
        headerStyle: {
          backgroundColor: "#3b82f6",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="create/index"
        options={{
          title: "Create Room",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#3b82f6",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: "Edit Room",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="delete/[id]"
        options={{
          title: "Delete Room",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="publish/[id]"
        options={{
          title: "Publish Room",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
