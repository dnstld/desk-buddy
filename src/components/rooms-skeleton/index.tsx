import { skeletonRooms } from "@/src/constants/skeleton-rooms";
import { View } from "react-native";
import Room from "../room";

/**
 * Skeleton loading component for rooms list
 * Shows placeholder Room components with clean data while actual data loads
 */
export default function RoomsSkeleton() {
  return (
    <View className="p-4 gap-4 opacity-50">
      {skeletonRooms.map((room) => (
        <Room key={room.id} room={room} showActions={false} />
      ))}
    </View>
  );
}
