import RoomForm from "@/src/components/room-form";
import Button from "@/src/components/ui/button";
import ConfirmationDialog from "@/src/components/ui/confirmation-dialog";
import { useRoomActions } from "@/src/hooks/use-room-actions";
import { RoomWithDetails } from "@/src/types/room";
import { RoomFormData } from "@/src/validations/room-form";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function EditRoom() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [room, setRoom] = useState<RoomWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock room data - replace with actual data fetching
  useEffect(() => {
    // TODO: Replace with actual API call to fetch room by ID
    const mockRoom: RoomWithDetails = {
      id: parseInt(id as string),
      room_name: `Room ${id}`,
      color: "#3B82F6",
      company_branch_id: 1,
      created_at: new Date().toISOString(),
      description: "Sample room description",
      desk_limit: 10,
      elevator: true,
      floor: 2,
      published: false,
      seat_limit: 12,
      wheelchair: true,
      pet_friendly: true,
      meeting: false,
      seats: [],
    };

    setTimeout(() => {
      setRoom(mockRoom);
      setLoading(false);
    }, 1000);
  }, [id]);

  const { confirmationProps, actions } = useRoomActions({
    room: room!,
    onRoomUpdate: (updatedRoom) => {
      setRoom(updatedRoom);
    },
  });

  const handleSubmit = async (data: RoomFormData) => {
    setIsSubmitting(true);
    try {
      // Here you would call your API to update the room
      console.log("Updating room with data:", data);

      // Simulate API call with potential failure (for testing error handling)
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate success most of the time, but occasionally fail for testing
          const shouldSucceed = Math.random() > 0.2; // 80% success rate
          if (shouldSucceed) {
            console.log("✅ Simulated API success");
            resolve(true);
          } else {
            console.log(
              "❌ Simulated API failure (this is expected for testing)"
            );
            reject(new Error("Server error: Unable to update room"));
          }
        }, 1000);
      });

      // Update local room data
      if (room) {
        const updatedRoom: RoomWithDetails = {
          ...room,
          room_name: data.name,
          description: data.description || null,
          seat_limit: data.totalSeats,
          meeting: data.meeting,
          wheelchair: data.wheelchair,
          elevator: data.elevator,
          pet_friendly: data.petFriendly,
          floor: data.floor,
          color: data.color,
        };
        setRoom(updatedRoom);
      }
    } catch (error) {
      console.error("Failed to update room:", error);
      throw error; // Re-throw to let RoomForm handle the error display
    } finally {
      setIsSubmitting(false);
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

  if (loading || !room) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray-500">Loading room...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <RoomForm
        initialData={room}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        submitButtonText="Save Changes"
        isLoading={isSubmitting}
      />

      {/* Delete Button - Positioned below the form */}
      <View className="p-4 border-t border-gray-200 bg-white">
        <Button
          title="Delete Room"
          icon="delete"
          onPress={actions.showDeleteConfirmation}
          variant="danger"
        />
      </View>

      {/* Confirmation Dialog */}
      <ConfirmationDialog {...confirmationProps} />
    </View>
  );
}
