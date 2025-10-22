import { useToast } from "@/providers/ToastProvider";
import { RoomWithDetails } from "@/src/types/room";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import ModalActions from "../modal-actions";
import InfoMessage from "../ui/info-message";

interface RoomDeleteProps {
  room: RoomWithDetails;
  onSubmit: () => Promise<void>;
  onSuccess?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function RoomDelete({
  room,
  onSubmit,
  onSuccess,
  onCancel,
  isLoading = false,
}: RoomDeleteProps) {
  const { showSuccess, showError } = useToast();

  const handleDelete = async () => {
    try {
      await onSubmit();

      // Show success toast
      showSuccess(`Room "${room.name}" deleted successfully!`);

      onSuccess?.();
    } catch (error) {
      // Show error toast
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete room";
      showError(errorMessage);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6">
        {/* Warning Header */}
        <View className="items-center mb-8">
          <View className="bg-red-100 rounded-full p-4 mb-4">
            <MaterialCommunityIcons name="delete" size={48} color="#DC2626" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Delete Room
          </Text>
          <Text className="text-gray text-center">
            Are you sure you want to delete this room?
          </Text>
        </View>

        {/* Room Details */}
        <View className="bg-gray-50 rounded-lg p-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            {room.name}
          </Text>

          {room.description && (
            <Text className="text-gray mb-4">{room.description}</Text>
          )}

          <View className="flex-row gap-4 mb-2">
            <View className="flex-1">
              <Text className="text-sm text-gray">Type</Text>
              <Text className="text-gray-900">
                {room.type === "meeting" ? "Meeting Room" : "Workspace"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray">Floor</Text>
              <Text className="text-gray-900">{room.floor}</Text>
            </View>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-sm text-gray">Capacity</Text>
              <Text className="text-gray-900">{room.capacity} seats</Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray">Status</Text>
              <Text className="text-gray-900">
                {room.published ? "Published" : "Draft"}
              </Text>
            </View>
          </View>
        </View>

        {/* Warning Message */}
        <InfoMessage
          variant="info"
          title="This action cannot be undone"
          message="Deleting this room will permanently remove it and all associated data from the system."
          icon="alert-circle"
        />
      </ScrollView>

      {/* Action Buttons */}
      <ModalActions
        onCancel={onCancel}
        onSubmit={handleDelete}
        submitText="Delete Room"
        submitVariant="danger"
        submitIcon="delete"
        isLoading={isLoading}
      />
    </View>
  );
}
