import { useToast } from "@/providers/ToastProvider";
import { RoomWithDetails } from "@/src/types/room";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import ModalActions from "@/src/components/modal-actions";
import InfoMessage from "@/src/components/ui/info-message";

interface RoomPublishProps {
  room: RoomWithDetails;
  onSubmit: () => Promise<void>;
  onSuccess?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function RoomPublish({
  room,
  onSubmit,
  onSuccess,
  onCancel,
  isLoading = false,
}: RoomPublishProps) {
  const { showSuccess, showError } = useToast();

  const handlePublish = async () => {
    try {
      await onSubmit();

      const action = room.published ? "unpublished" : "published";

      // Show success toast
      showSuccess(`Room "${room.name}" ${action} successfully!`);

      onSuccess?.();
    } catch (error) {
      // Show error toast
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to publish/unpublish room";
      showError(errorMessage);
    }
  };

  const isPublishing = !room.published;
  const action = isPublishing ? "Publish" : "Unpublish";

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6">
        {/* Header */}
        <View className="items-center mb-8">
          <View
            className={`rounded-full p-4 mb-4 ${
              isPublishing ? "bg-green-100" : "bg-orange-100"
            }`}
          >
            <MaterialCommunityIcons
              name="publish"
              size={48}
              color={isPublishing ? "#10B981" : "#F59E0B"}
            />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {action} Room
          </Text>
          <Text className="text-gray-600 text-center">
            {isPublishing
              ? "Make this room available for bookings"
              : "Hide this room from bookings"}
          </Text>
        </View>

        {/* Room Details */}
        <View className="bg-gray-50 rounded-lg p-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            {room.name}
          </Text>

          {room.description && (
            <Text className="text-gray-600 mb-4">{room.description}</Text>
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
              <Text className="text-sm text-gray">Current Status</Text>
              <Text className="text-gray-900">
                {room.published ? "Published" : "Draft"}
              </Text>
            </View>
          </View>
        </View>

        {/* Info Message */}
        <InfoMessage
          variant={isPublishing ? "info" : "warning"}
          title={
            isPublishing
              ? "Room will be visible to all users"
              : "Room will be hidden from users"
          }
          message={
            isPublishing
              ? "Users will be able to view and book seats in this room."
              : "Users will no longer be able to view or book this room, but existing reservations will remain."
          }
        />
      </ScrollView>

      {/* Action Buttons */}
      <ModalActions
        onCancel={onCancel}
        onSubmit={handlePublish}
        submitText={`${action} Room`}
        submitVariant={isPublishing ? "success" : "primary"}
        submitIcon="publish"
        isLoading={isLoading}
      />
    </View>
  );
}
