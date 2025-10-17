import RoomDelete from "@/src/components/room-delete";
import { useFetchRoom } from "@/src/hooks/use-fetch-room";
import { useRoomMutations } from "@/src/hooks/use-room-mutations";
import { logger } from "@/src/utils/logger";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function DeleteRoom() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { room, loading, error } = useFetchRoom(id);
  const { deleteRoom } = useRoomMutations();
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async () => {
    if (!room) return;

    setDeleting(true);

    try {
      await deleteRoom(room.id);
      logger.success(`Room "${room.name}" deleted successfully`);
    } catch (error) {
      logger.error("Failed to delete room:", error);
      throw error;
    } finally {
      setDeleting(false);
    }
  };

  const handleSuccess = () => {
    router.replace("/(app)/rooms/" as any);
    logger.success("Room deleted successfully! (Navigation completed)");
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !room) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-red-500 text-center mb-4">
          {error || "Room not found"}
        </Text>
        <Text className="text-blue-500" onPress={() => router.back()}>
          Go Back
        </Text>
      </View>
    );
  }

  return (
    <RoomDelete
      room={room}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
      isLoading={deleting}
    />
  );
}
