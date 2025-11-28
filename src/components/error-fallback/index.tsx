import AuthLogo from "@/src/components/auth-logo";
import Button from "@/src/components/ui/button";
import Text from "@/src/components/ui/text";
import React from "react";
import { Text as RNText, ScrollView, View } from "react-native";

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export default function ErrorFallback({
  error,
  resetError,
}: ErrorFallbackProps) {
  return (
    <View className="flex-1 bg-error">
      <ScrollView contentContainerClassName="flex-1 justify-center items-center px-4">
        <View className="w-full max-w-xs gap-8">
          <AuthLogo size="medium" />

          <View className="gap-4">
            <Text className="text-2xl font-bold text-center">
              Oops! Something went wrong
            </Text>

            <Text className="text-center">
              The app encountered an unexpected error. Don't worry, your data is
              safe.
            </Text>

            {__DEV__ && error && (
              <View className="w-full gap-2 mt-4">
                <Text className="text-sm font-semibold">
                  Error Details (Dev Mode):
                </Text>
                <View className="bg-black/20 p-4 rounded-lg w-full">
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <RNText className="text-white text-xs font-mono">
                      {error.toString()}
                    </RNText>
                  </ScrollView>
                  {error.stack && (
                    <View className="mt-2 pt-2 border-t border-white/20">
                      <RNText className="text-white/70 text-xs font-mono">
                        {error.stack.slice(0, 300)}
                        {error.stack.length > 300 ? "..." : ""}
                      </RNText>
                    </View>
                  )}
                </View>
              </View>
            )}

            <Button
              onPress={resetError}
              title="Restart App"
              variant="ghost"
              icon="refresh"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
