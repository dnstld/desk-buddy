import { useUser } from "@/providers/UserProvider";
import AppPageWrapper from "@/src/components/app-page-wrapper";
import Room from "@/src/components/room";
import RoomsEmpty from "@/src/components/rooms-empty";
import FAB from "@/src/components/ui/fab";
import { useRooms } from "@/src/hooks";
import { RoomWithDetails } from "@/src/types/room";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function Rooms() {
  const { rooms, loading, error } = useRooms();
  const { isMember } = useUser();

  const handleCreateRoom = () => {
    router.push("/(app)/rooms/create");
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
        <Text className="text-error text-center mb-4">{error}</Text>
      </View>
    );
  }

  return (
    <AppPageWrapper scrollable={false}>
      <FlatList
        data={rooms}
        renderItem={renderRoom}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<RoomsEmpty />}
      />

      {!isMember && <FAB onPress={handleCreateRoom} />}
    </AppPageWrapper>
  );
}
