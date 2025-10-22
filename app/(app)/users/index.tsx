import AppPageWrapper from "@/src/components/app-page-wrapper";
import React from "react";
import { Text, View } from "react-native";

export default function Users() {
  return (
    <AppPageWrapper className="items-center justify-center">
      <View className="items-center">
        <Text className="text-white text-lg">Users</Text>
        <Text className="text-gray-400">Coming soon</Text>
      </View>
    </AppPageWrapper>
  );
}
