import AppPageWrapper from "@/src/components/layout/app-page-wrapper";
import React from "react";
import { Text, View } from "react-native";

export default function HowItWorks() {
  return (
    <AppPageWrapper className="items-center justify-center">
      <View className="items-center">
        <Text>How it works</Text>
        <Text>Coming soon</Text>
      </View>
    </AppPageWrapper>
  );
}
