import RoomDelete from "@/src/components/room-delete";
import { useDeleteRoomMutation, useFetchRoom } from "@/src/hooks";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function DeleteRoom() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { room, loading, error } = useFetchRoom(id);
  const deleteRoom = useDeleteRoomMutation();
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async () => {
    if (!room) return;

    setDeleting(true);

    try {
      await deleteRoom.mutateAsync(room.id);
    } catch (error) {
      throw error;
    } finally {
      setDeleting(false);
    }
  };

  const handleSuccess = () => {
    router.replace("/(app)/rooms/" as any);
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
        <Text className="text-error text-center mb-4">
          {error || "Room not found"}
        </Text>
        <Text className="text-primary" onPress={() => router.back()}>
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
