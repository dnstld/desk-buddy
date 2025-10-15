import RoomForm from "@/src/components/room-form";
import { useRoomMutations } from "@/src/hooks/use-room-mutations";
import { supabase } from "@/src/lib/supabase";
import { RoomWithDetails } from "@/src/types/room";
import { RoomFormData } from "@/src/validations/room-form";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function EditRoom() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [room, setRoom] = useState<RoomWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { updateRoom } = useRoomMutations();

  // Fetch room data from database
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: roomData, error: roomError } = await supabase
          .from("room")
          .select(
            `
            *,
            seats:seat(
              *,
              reservation(
                *,
                user(*)
              )
            )
          `
          )
          .eq("id", id) // id is already a UUID string
          .is("deleted_at", null)
          .single();

        if (roomError) throw roomError;
        if (!roomData) throw new Error("Room not found");

        setRoom(roomData);
      } catch (err) {
        console.error("Error fetching room:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch room");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoom();
    }
  }, [id]);

  const handleSubmit = async (data: RoomFormData) => {
    try {
      console.log("Updating room with data:", data);

      // Update the room using Supabase
      const updatedRoom = await updateRoom(id as string, data);

      // Update local room data
      if (updatedRoom) {
        setRoom(updatedRoom as RoomWithDetails);
      }

      console.log("✅ Room updated successfully!");
    } catch (error) {
      console.error("Failed to update room:", error);
      throw error; // Re-throw to let RoomForm handle the error display
    }
  };

  const handleSuccess = () => {
    // Navigate back immediately
    router.back();

    // TODO: In a real app, you could:
    // 1. Use navigation state to pass success message
    // 2. Use a global state management solution
    // 3. Show the toast on the destination screen
    console.log("✅ Room updated successfully! (Navigation completed)");
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
    <View className="flex-1 bg-white">
      <RoomForm
        initialData={room}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        submitButtonText="Save"
      />
    </View>
  );
}
