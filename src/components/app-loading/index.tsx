import Logo from "@/src/components/logo";
import Text from "@/src/components/ui/text";
import { ActivityIndicator, ScrollView, View } from "react-native";

export default function AppLoading() {
  return (
    <View className="flex-1 bg-primary">
      <ScrollView contentContainerClassName="flex-1 justify-center items-center px-4">
        <View className="w-full max-w-xs gap-8">
          <Logo size="medium" />

          <View className="gap-4">
            <Text className="text-2xl font-bold text-center">
              Setting up your account
            </Text>

            <Text className="text-center">
              Please wait while we prepare everything
            </Text>

            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
