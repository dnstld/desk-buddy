import { Stack } from "expo-router";

export default function PublicLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="how-it-works"
        options={{
          title: "How it works",
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: "Privacy Policy",
        }}
      />
      <Stack.Screen
        name="terms"
        options={{
          title: "Terms of Service",
        }}
      />
    </Stack>
  );
}
