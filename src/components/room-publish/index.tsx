import { RoomWithDetails } from "@/src/types/room";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import ModalActions from "../modal-actions";
import Toast from "../ui/toast";

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

  const handlePublish = async () => {
    try {
      await onSubmit();

      const action = room.published ? "unpublished" : "published";

      // Show success toast first
      showToastNotification(
        `Room "${room.name}" ${action} successfully!`,
        "success"
      );

      // Call success callback after a delay to allow toast to show
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (error) {
      // Show error toast
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to publish/unpublish room";
      showToastNotification(errorMessage, "error");
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
              <Text className="text-sm text-gray-500">Current Status</Text>
              <Text className="text-gray-900">
                {room.published ? "Published" : "Draft"}
              </Text>
            </View>
          </View>
        </View>

        {/* Info Message */}
        <View
          className={`border rounded-lg p-4 mb-6 ${
            isPublishing
              ? "bg-green-50 border-green-200"
              : "bg-orange-50 border-orange-200"
          }`}
        >
          <View className="flex-row items-start gap-3">
            <MaterialCommunityIcons
              name="information"
              size={24}
              color={isPublishing ? "#10B981" : "#F59E0B"}
            />
            <View className="flex-1">
              <Text
                className={`font-semibold mb-1 ${
                  isPublishing ? "text-green-900" : "text-orange-900"
                }`}
              >
                {isPublishing
                  ? "Room will be visible to all users"
                  : "Room will be hidden from users"}
              </Text>
              <Text
                className={isPublishing ? "text-green-700" : "text-orange-700"}
              >
                {isPublishing
                  ? "Users will be able to view and book seats in this room."
                  : "Users will no longer be able to view or book this room, but existing reservations will remain."}
              </Text>
            </View>
          </View>
        </View>
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
