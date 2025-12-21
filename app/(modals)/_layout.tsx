import Icon from "@/src/components/ui/icon";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function ModalsLayout() {
  const router = useRouter();

  const HeaderCloseButton = () => (
    <Pressable onPress={() => router.back()}>
      <Icon name="close" />
    </Pressable>
  );

  return (
    <Stack
      screenOptions={{
        presentation: "modal",
        headerRight: () => <HeaderCloseButton />,
      }}
    >
      <Stack.Screen
        name="room/create"
        options={{
          title: "Create Room",
        }}
      />
      <Stack.Screen
        name="room/edit/[id]"
        options={{
          title: "Edit Room",
        }}
      />
      <Stack.Screen
        name="room/delete/[id]"
        options={{
          title: "Delete Room",
        }}
      />
      <Stack.Screen
        name="room/publish/[id]"
        options={{
          title: "Publish Room",
        }}
      />
      <Stack.Screen
        name="company/confirm-ownership"
        options={{
          title: "Confirm Ownership",
        }}
      />
      <Stack.Screen
        name="user/[id]"
        options={{
          title: "Person details",
        }}
      />
    </Stack>
  );
}
