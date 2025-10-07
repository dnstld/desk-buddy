import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Text, View } from "react-native";

export default function Index() {
  useFocusEffect(
    useCallback(() => {
      // Redirect to /rooms route when the screen comes into focus
      router.replace("/rooms");
    }, [])
  );

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Desk Buddy!
      </Text>
    </View>
  );
}
