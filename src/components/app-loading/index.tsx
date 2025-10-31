import { colors } from "@/src/theme/colors";
import { ActivityIndicator, Text, View } from "react-native";
import CallbackPageWrapper from "../callback-page-wrapper";

export default function AppLoading() {
  return (
    <CallbackPageWrapper>
      <View className="w-full max-w-sm gap-8">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <View className="gap-2">
          <Text className="text-2xl font-bold text-white text-center">
            Setting up your account
          </Text>
          <Text className="text-base text-white text-center">
            Please wait while we prepare everything
          </Text>
        </View>
      </View>
    </CallbackPageWrapper>
  );
}
