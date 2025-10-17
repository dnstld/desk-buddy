import { RoomWithDetails } from "@/src/types/room";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import ModalActions from "../modal-actions";
import Toast from "../ui/toast";

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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );

  const showToastNotification = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleDelete = async () => {
    try {
      await onSubmit();

      // Show success toast first
      showToastNotification(
        `Room "${room.name}" deleted successfully!`,
        "success"
      );

      // Call success callback after a delay to allow toast to show
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (error) {
      // Show error toast
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete room";
      showToastNotification(errorMessage, "error");
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
          <Text className="text-gray-600 text-center">
            Are you sure you want to delete this room?
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
              <Text className="text-sm text-gray-500">Type</Text>
              <Text className="text-gray-900">
                {room.type === "meeting" ? "Meeting Room" : "Workspace"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-500">Floor</Text>
              <Text className="text-gray-900">{room.floor}</Text>
            </View>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-sm text-gray-500">Capacity</Text>
              <Text className="text-gray-900">{room.capacity} seats</Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-500">Status</Text>
              <Text className="text-gray-900">
                {room.published ? "Published" : "Draft"}
              </Text>
            </View>
          </View>
        </View>

        {/* Warning Message */}
        <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <View className="flex-row items-start gap-3">
            <MaterialCommunityIcons
              name="alert-circle"
              size={24}
              color="#DC2626"
            />
            <View className="flex-1">
              <Text className="font-semibold text-red-900 mb-1">
                This action cannot be undone
              </Text>
              <Text className="text-red-700">
                Deleting this room will permanently remove it and all associated
                data from the system.
              </Text>
            </View>
          </View>
        </View>
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

      {/* Toast Notifications */}
      <Toast
        visible={showToast}
        message={toastMessage}
        type={toastType}
        onHide={() => setShowToast(false)}
      />
    </View>
  );
}
