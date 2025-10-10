import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Text, View } from "react-native";

export default function RoomsEmpty() {
  return (
    <View className="bg-white rounded-lg shadow-sm p-6 gap-4">
      {/* Header Section */}
      <View className="items-center gap-4">
        <View className="bg-primary-50 w-20 h-20 rounded-full items-center justify-center">
          <MaterialCommunityIcons
            name="office-building-plus-outline"
            size={40}
            color="#3B82F6"
          />
        </View>

        <View className="items-center gap-2">
          <Text className="text-2xl font-bold text-gray-900">No Rooms Yet</Text>
          <Text className="text-base text-gray-600 text-center">
            Create your first room to start managing desk reservations
          </Text>
        </View>
      </View>

      {/* Information Section */}
      <View className="gap-3 mt-2">
        <View className="flex-row items-start gap-3">
          <View className="bg-primary-100 w-8 h-8 rounded-full items-center justify-center mt-1">
            <MaterialCommunityIcons name="seat" size={16} color="#3B82F6" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-900 mb-1">
              Workspace & Meeting Rooms
            </Text>
            <Text className="text-xs text-gray-600 leading-relaxed">
              Create both workspace areas for daily desk booking and meeting
              rooms for team collaboration
            </Text>
          </View>
        </View>

        <View className="flex-row items-start gap-3">
          <View className="bg-green-100 w-8 h-8 rounded-full items-center justify-center mt-1">
            <MaterialCommunityIcons
              name="calendar-check"
              size={16}
              color="#10B981"
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-900 mb-1">
              Real-time Availability
            </Text>
            <Text className="text-xs text-gray-600 leading-relaxed">
              Track seat occupancy and availability in real-time with visual
              indicators
            </Text>
          </View>
        </View>

        <View className="flex-row items-start gap-3">
          <View className="bg-purple-100 w-8 h-8 rounded-full items-center justify-center mt-1">
            <MaterialCommunityIcons name="cog" size={16} color="#8B5CF6" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-900 mb-1">
              Easy Management
            </Text>
            <Text className="text-xs text-gray-600 leading-relaxed">
              Configure amenities, set capacity limits, and manage room settings
              with ease
            </Text>
          </View>
        </View>
      </View>

      {/* Call to Action */}
      <View className="mt-4 pt-4 border-t border-gray-100">
        <View className="flex-row items-center justify-center gap-2">
          <MaterialCommunityIcons name="plus-circle" size={16} />
          <Text className="text-sm font-medium text-gray-700">
            Tap the button below to create your first room
          </Text>
        </View>
      </View>
    </View>
  );
}
