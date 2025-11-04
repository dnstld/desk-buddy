import { useToast } from "@/providers/ToastProvider";
import RoomForm from "@/src/components/room-form";
import { useFetchRoom, useUpdateRoomMutation } from "@/src/hooks";
import { RoomWithDetails } from "@/src/types/room";
import { RoomFormData } from "@/src/validations/room-form";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function EditRoom() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { room, setRoom, loading, error } = useFetchRoom(id);
  const updateRoom = useUpdateRoomMutation();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (data: RoomFormData) => {
    const updatedRoom = await updateRoom.mutateAsync({
      roomId: id as string,
      formData: data,
    });

    if (updatedRoom) {
      setRoom(updatedRoom as RoomWithDetails);
    }
  };

  const handleSuccess = () => {
    showSuccess("Room updated successfully!");
    router.replace("/(app)/rooms");
  };

  const handleError = (error: Error) => {
    showError(error.message || "Failed to update room");
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
    <View className="flex-1 bg-white">
      <RoomForm
        initialData={room}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        onError={handleError}
        onCancel={handleCancel}
        submitButtonText="Save"
      />
    </View>
  );
}
