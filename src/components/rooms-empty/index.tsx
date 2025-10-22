import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Text, View } from "react-native";

export default function RoomsEmpty() {
  return (
    <View className="bg-white rounded-lg shadow-sm p-8">
      {/* Header Section */}
      <View className="items-center gap-2 mb-10">
        <Text className="text-2xl font-bold text-gray-900">
          Let&apos;s get started
        </Text>
        <Text className="text-sm text-gray">
          Create your first room in two quick steps
        </Text>
      </View>

      {/* Steps */}
      <View className="gap-8">
        {/* Step 1 */}
        <View className="flex-row items-start gap-5">
          <View className="items-center pt-1">
            <View className="bg-blue-100 w-12 h-12 rounded-xl items-center justify-center">
              <MaterialCommunityIcons
                name="pencil-outline"
                size={22}
                color="#3B82F6"
              />
            </View>
          </View>
          <View className="flex-1">
            <View className="flex-row items-baseline gap-2 mb-2">
              <Text className="text-xs font-bold text-primary">STEP 1</Text>
            </View>
            <Text className="text-lg font-semibold text-gray-900 mb-1">
              Create a room
            </Text>
            <Text className="text-sm text-gray leading-relaxed">
              Add a workspace for desk booking or a meeting room for team
              sessions
            </Text>
          </View>
        </View>

        {/* Step 2 */}
        <View className="flex-row items-start gap-5">
          <View className="items-center pt-1">
            <View className="bg-green-100 w-12 h-12 rounded-xl items-center justify-center">
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={22}
                color="#10B981"
              />
            </View>
          </View>
          <View className="flex-1">
            <View className="flex-row items-baseline gap-2 mb-2">
              <Text className="text-xs font-bold text-success">STEP 2</Text>
            </View>
            <Text className="text-lg font-semibold text-gray-900 mb-1">
              Publish it
            </Text>
            <Text className="text-sm text-gray leading-relaxed">
              Make it live so your team can start booking right away
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
