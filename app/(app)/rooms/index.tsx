import AppPageWrapper from "@/src/components/app-page-wrapper";
import QueryError from "@/src/components/query-error";
import Room from "@/src/components/room";
import RoomsEmpty from "@/src/components/rooms-empty";
import RoomsLoading from "@/src/components/rooms-loading";
import FAB from "@/src/components/ui/fab";
import { useRoomsQuery, useUser } from "@/src/hooks";
import { RoomWithDetails } from "@/src/types/room";
import { router } from "expo-router";
import { useCallback, useMemo } from "react";
import { FlatList, ListRenderItem } from "react-native";

// Approximate height of a Room component in pixels
// Adjust this value based on your actual Room component height
const ESTIMATED_ROOM_HEIGHT = 280;
const ROOM_GAP = 16;

export default function Rooms() {
  const { data: rooms, isLoading, error, refetch } = useRoomsQuery();
  const { isMember } = useUser();

  const handleCreateRoom = useCallback(() => {
    router.push("/(app)/rooms/create");
  }, []);

  // Memoize renderItem to prevent recreating on every render
  const renderRoom: ListRenderItem<RoomWithDetails> = useCallback(
    ({ item }) => <Room room={item} />,
    []
  );

  // Memoize keyExtractor to prevent recreating on every render
  const keyExtractor = useCallback(
    (item: RoomWithDetails) => item.id.toString(),
    []
  );

  // Optimize FlatList performance with getItemLayout
  // This tells FlatList the exact size of items, enabling better virtualization
  const getItemLayout = useCallback(
    (_data: ArrayLike<RoomWithDetails> | null | undefined, index: number) => ({
      length: ESTIMATED_ROOM_HEIGHT,
      offset: (ESTIMATED_ROOM_HEIGHT + ROOM_GAP) * index,
      index,
    }),
    []
  );

  // Memoize content container style
  const contentContainerStyle = useMemo(() => ({ padding: 16, gap: 16 }), []);

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
        keyExtractor={keyExtractor}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<RoomsEmpty />}
        // Performance optimizations
        removeClippedSubviews={true} // Unmount components outside viewport
        maxToRenderPerBatch={10} // Reduce number of items rendered per batch
        updateCellsBatchingPeriod={50} // Increase time between renders
        initialNumToRender={10} // Reduce initial render amount
        windowSize={10} // Reduce viewport window size
        getItemLayout={getItemLayout} // Enable item size optimization
        // Memory optimization
        onEndReachedThreshold={0.5} // Trigger onEndReached earlier
      />

      {!isMember && <FAB onPress={handleCreateRoom} />}
    </AppPageWrapper>
  );
}
