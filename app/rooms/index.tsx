import Room from "@/src/components/room";
import RoomsEmpty from "@/src/components/rooms-empty";
import { mockRooms } from "@/src/data/mockRooms";
import { RoomWithDetails } from "@/src/types/room";
import { router } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function Rooms() {
  const handleCreateRoom = () => {
    router.push("/rooms/create");
  };

  const renderRoom = ({ item }: { item: RoomWithDetails }) => (
    <Room room={item} />
  );

  // Show empty state if no rooms
  if (mockRooms.length === 0) {
    return (
      <View className="flex-1 bg-gray-50">
        <RoomsEmpty />

        {/* Floating Action Button */}
        <TouchableOpacity
          onPress={handleCreateRoom}
          className="absolute bottom-8 right-8 bg-blue-500 w-16 h-16 rounded-full items-center justify-center shadow-lg"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text className="text-white text-4xl font-bold">+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Your Rooms</Text>
        <Text className="text-sm text-gray-500 mt-1">
          {mockRooms.length} rooms
        </Text>
      </View>

      {/* Rooms List */}
      <FlatList
        data={mockRooms}
        renderItem={renderRoom}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleCreateRoom}
        className="absolute bottom-8 right-8 bg-blue-500 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Text className="text-white text-4xl font-bold">+</Text>
      </TouchableOpacity>
    </View>
  );
}
