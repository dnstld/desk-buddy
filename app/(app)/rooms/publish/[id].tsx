import RoomPublish from "@/src/components/room-publish";
import { useFetchRoom, useRoomMutations } from "@/src/hooks";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function PublishRoom() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { room, loading, error } = useFetchRoom(id);
  const { publishRoom } = useRoomMutations();
  const [publishing, setPublishing] = useState(false);

  const handleSubmit = async () => {
    if (!room) return;

    setPublishing(true);

    try {
      const newPublishedState = !room.published;
      await publishRoom(room.id, newPublishedState);

      const action = newPublishedState ? "published" : "unpublished";
    } catch (error) {
      throw error;
    } finally {
      setPublishing(false);
    }
  };

  const handleSuccess = () => {
    router.replace("/(app)/rooms/" as any);
    const action = room?.published ? "unpublished" : "published";
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
    <RoomPublish
      room={room}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
      isLoading={publishing}
    />
  );
}
