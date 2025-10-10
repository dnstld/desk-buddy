import Room from "@/src/components/room";
import RoomsEmpty from "@/src/components/rooms-empty";
import FAB from "@/src/components/ui/fab";
import { mockRooms } from "@/src/data/mockRooms";
import { RoomWithDetails } from "@/src/types/room";
import { router } from "expo-router";
import { FlatList, View } from "react-native";
import HeaderWithMenu from "../../components/HeaderWithMenu";

export default function Rooms() {
  const handleCreateRoom = () => {
    router.push("/rooms/create");
  };

  const renderRoom = ({ item }: { item: RoomWithDetails }) => (
    <Room room={item} />
  );

  return (
    <View className="flex-1 bg-gray-50">
      <HeaderWithMenu
        title="Your Rooms"
        subtitle={`${mockRooms.length} rooms`}
      />

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
