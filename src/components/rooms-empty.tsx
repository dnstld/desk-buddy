import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function RoomsEmpty() {
  const handleCreateRoom = () => {
    router.push("/rooms/create");
  };

  return (
    <View className="flex-1 items-center justify-center p-8">
      <View className="bg-gray-100 w-24 h-24 rounded-full items-center justify-center mb-6">
        <Text className="text-4xl">🏢</Text>
      </View>

      <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
        No Rooms Yet
      </Text>

      <Text className="text-gray-500 text-center mb-8 leading-relaxed">
        Create your first room to start managing desk reservations for your
        team.
      </Text>

      <TouchableOpacity
        onPress={handleCreateRoom}
        className="bg-blue-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Create First Room</Text>
      </TouchableOpacity>
    </View>
  );
}
