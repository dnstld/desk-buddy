import Logo from "@/src/components/logo";
import Text from "@/src/components/ui/text";
import { colors } from "@/src/theme/colors";
import { ActivityIndicator, ScrollView, View } from "react-native";

export default function AppLoading() {
  return (
    <View className="flex-1 bg-warning">
      <ScrollView contentContainerClassName="flex-1 justify-center items-center px-4">
        <View className="w-full max-w-xs gap-8">
          <Logo size="large" />

          <View className="gap-4">
            <Text variant="2xl" className="font-bold text-center">
              Greetings
            </Text>

            <Text className="text-center" variant="xl">
              I’m checking your access now. Please wait a moment
            </Text>

            <ActivityIndicator size="large" color={colors.foreground.DEFAULT} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
