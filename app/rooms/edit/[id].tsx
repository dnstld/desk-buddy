import Button from "@/src/components/ui/button";
import ConfirmationDialog from "@/src/components/ui/confirmation-dialog";
import { useRoomActions } from "@/src/hooks/use-room-actions";
import { RoomWithDetails } from "@/src/types/room";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function EditRoom() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [room, setRoom] = useState<RoomWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleSave = () => {
    // TODO: Implement save logic
    console.log("Save room changes");
    router.back();
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
      <ScrollView className="flex-1 px-4 py-6">
        {/* Room Form Content */}
        <View className="items-center justify-center py-20">
          <Text className="text-gray-600 text-lg text-center mb-4">
            Edit Room Form
          </Text>
          <Text className="text-2xl font-bold text-primary-500 mb-2">
            {room.room_name}
          </Text>
          <Text className="text-gray-500 text-sm">Room ID: {id}</Text>
          <Text className="text-gray-400 text-xs mt-4 text-center px-8">
            This will contain the room editing form fields, similar to the
            create room screen.
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="p-4 border-t border-gray-200 bg-white">
        <View className="space-y-3">
          {/* Primary Action */}
          <Button
            title="Save Changes"
            icon="content-save"
            onPress={handleSave}
            variant="primary"
          />

          {/* Secondary Action */}
          <Button
            title="Delete Room"
            icon="delete"
            onPress={actions.showDeleteConfirmation}
            variant="danger"
          />
        </View>
      </View>

      {/* Confirmation Dialog */}
      <ConfirmationDialog {...confirmationProps} />
    </View>
  );
}
