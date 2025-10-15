import Room from "@/src/components/room";
import RoomsEmpty from "@/src/components/rooms-empty";
import FAB from "@/src/components/ui/fab";
import { useRooms } from "@/src/hooks/use-rooms";
import { RoomWithDetails } from "@/src/types/room";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function Rooms() {
  const { rooms, loading, error } = useRooms();

  const handleCreateRoom = () => {
    // Type assertion needed due to Expo Router's strict typing
    router.push("/(app)/rooms/create/" as any);
  };

  const renderRoom = ({ item }: { item: RoomWithDetails }) => (
    <Room room={item} />
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={rooms}
        renderItem={renderRoom}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<RoomsEmpty />}
      />

      <FAB onPress={handleCreateRoom} />
    </View>
  );
}
