import Room from "@/src/components/room";
import RoomsEmpty from "@/src/components/rooms-empty";
import FAB from "@/src/components/ui/fab";
import { mockRooms } from "@/src/data/mockRooms";
import { RoomWithDetails } from "@/src/types/room";
import { router } from "expo-router";
import { FlatList, View } from "react-native";

export default function Rooms() {
  const handleCreateRoom = () => {
    router.push("/(app)/rooms/create/" as any);
  };

  const renderRoom = ({ item }: { item: RoomWithDetails }) => (
    <Room room={item} />
  );

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={mockRooms}
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
