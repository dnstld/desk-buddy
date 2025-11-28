import Button from "@/src/components/ui/button";
import Text from "@/src/components/ui/text";
import { colors } from "@/src/theme/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ScrollView, View } from "react-native";

interface QueryErrorProps {
  error: Error | null;
  onRetry: () => void;
  title?: string;
  description?: string;
}

export default function QueryError({
  error,
  onRetry,
  title = "Something went wrong",
  description = "We couldn't load the data. Please try again.",
}: QueryErrorProps) {
  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";

  return (
    <ScrollView contentContainerClassName="flex-1 flex-col justify-around items-center bg-background">
      <View className="w-full max-w-sm gap-8">
        <View className="items-center gap-4">
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={64}
            color={colors.error.DEFAULT}
          />

          <View className="gap-2">
            <Text variant="2xl" className="font-bold text-white text-center">
              {title}
            </Text>
            <Text className="text-white text-center opacity-80">
              {description}
            </Text>
          </View>

          <View className="items-center bg-white/10 rounded-lg p-4 w-full">
            <Text variant="sm" className="text-white text-center">
              {errorMessage}
            </Text>
          </View>
        </View>

        <Button
          title="Try Again"
          onPress={onRetry}
          variant="primary"
          size="md"
          icon="refresh"
        />
      </View>
    </ScrollView>
  );
}
