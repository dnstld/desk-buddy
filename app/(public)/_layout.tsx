import { colors } from "@/src/theme/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function PublicLayout() {
  const router = useRouter();

  const headerRight = () => (
    <Pressable onPress={() => router.back()}>
      <MaterialCommunityIcons
        name="close"
        size={24}
        color={colors.foreground.DEFAULT}
      />
    </Pressable>
  );

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.DEFAULT,
        },
        headerRight,
      }}
    >
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
