import Text from "@/src/components/ui/text";
import { colors } from "@/src/theme/colors";
import { ActivityIndicator, ScrollView, View } from "react-native";

export default function RoomsLoading() {
  return (
    <ScrollView contentContainerClassName="flex-1 flex-col justify-around items-center bg-background">
      <View className="w-full max-w-sm gap-8">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <View className="gap-2">
          <Text className="text-2xl font-bold text-white text-center">
            Loading rooms
          </Text>
          <Text className="text-white text-center">
            Please wait while we fetch your rooms
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
