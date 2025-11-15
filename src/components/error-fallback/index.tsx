import Button from "@/src/components/ui/button";
import { colors } from "@/src/theme/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { ScrollView, Text, View } from "react-native";

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export default function ErrorFallback({
  error,
  resetError,
}: ErrorFallbackProps) {
  return (
    <ScrollView
      contentContainerClassName="flex-1 justify-center items-center p-8 bg-background"
      bounces={false}
    >
      <View className="gap-6 items-center max-w-sm w-full">
        {/* Error Icon */}
        <View className="items-center gap-4">
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={80}
            color={colors.error.DEFAULT}
          />

          {/* Title */}
          <Text className="text-2xl font-bold text-white text-center">
            Oops! Something went wrong
          </Text>

          {/* Description */}
          <Text className="text-base text-gray-400 text-center">
            The app encountered an unexpected error. Don't worry, your data is
            safe. Please try restarting the app.
          </Text>
        </View>

        {/* Error Details (Development Only) */}
        {__DEV__ && error && (
          <View className="w-full gap-2">
            <Text className="text-sm font-semibold text-gray-300">
              Error Details (Dev Mode):
            </Text>
            <View className="bg-gray-900 p-4 rounded-lg w-full border border-gray-700">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Text className="text-error text-xs font-mono">
                  {error.toString()}
                </Text>
              </ScrollView>
              {error.stack && (
                <View className="mt-2 pt-2 border-t border-gray-700">
                  <Text className="text-gray-500 text-xs font-mono">
                    {error.stack.slice(0, 500)}
                    {error.stack.length > 500 ? "..." : ""}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Actions */}
        <View className="w-full gap-3">
          <Button
            title="Restart App"
            onPress={resetError}
            variant="primary"
            size="lg"
            icon="refresh"
          />

          {__DEV__ && (
            <Text className="text-xs text-gray-500 text-center">
              💡 This error boundary caught a runtime error.{"\n"}
              Check the console for more details.
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
