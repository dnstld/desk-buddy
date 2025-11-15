import Button from "@/src/components/ui/button";
import React from "react";
import { Text, View } from "react-native";

/**
 * Test component to demonstrate Error Boundary functionality
 * This can be imported anywhere to test error handling
 *
 * @example
 * import ErrorBoundaryTest from "@/src/components/error-boundary-test";
 * <ErrorBoundaryTest />
 */
export default function ErrorBoundaryTest() {
  const [shouldThrow, setShouldThrow] = React.useState(false);

  if (shouldThrow) {
    // This will trigger the Error Boundary
    throw new Error("Test error from ErrorBoundaryTest component!");
  }

  return (
    <View className="p-8 gap-4 bg-gray-800 rounded-lg">
      <Text className="text-white text-lg font-bold">
        🧪 Error Boundary Test
      </Text>
      <Text className="text-gray-400 text-sm">
        Click the button below to trigger an error and test the Error Boundary.
      </Text>
      <Button
        title="Trigger Error"
        onPress={() => setShouldThrow(true)}
        variant="danger"
        icon="alert-circle"
      />
    </View>
  );
}
