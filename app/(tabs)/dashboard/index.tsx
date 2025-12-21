import AppPageWrapper from "@/src/components/layout/app-page-wrapper";
import React from "react";
import { Text, View } from "react-native";

export default function Dashboard() {
  return (
    <AppPageWrapper className="items-center justify-center">
      <View className="items-center">
        <Text>Dashboard</Text>
        <Text>Coming soon</Text>
      </View>
    </AppPageWrapper>
  );
}
