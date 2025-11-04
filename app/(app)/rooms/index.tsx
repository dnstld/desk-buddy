import AppPageWrapper from "@/src/components/app-page-wrapper";
import QueryError from "@/src/components/query-error";
import Room from "@/src/components/room";
import RoomsEmpty from "@/src/components/rooms-empty";
import RoomsLoading from "@/src/components/rooms-loading";
import FAB from "@/src/components/ui/fab";
import { useRoomsQuery, useUser } from "@/src/hooks";
import { RoomWithDetails } from "@/src/types/room";
import { router } from "expo-router";
import { FlatList } from "react-native";

export default function Rooms() {
  const { data: rooms, isLoading, error, refetch } = useRoomsQuery();
  const { isMember } = useUser();

  const handleCreateRoom = () => {
    router.push("/(app)/rooms/create");
  };

  const renderRoom = ({ item }: { item: RoomWithDetails }) => (
    <Room room={item} />
  );

  if (isLoading) {
    return <RoomsLoading />;
  }

  if (error) {
    return (
      <QueryError
        error={error}
        onRetry={refetch}
        title="Failed to load rooms"
        description="We couldn't fetch your rooms. Please try again."
      />
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
