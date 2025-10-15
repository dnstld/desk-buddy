import { useRoom } from "@/src/hooks/use-room";
import { useRoomMutations } from "@/src/hooks/use-room-mutations";
import { RoomWithDetails } from "@/src/types/room";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { logger } from "../../utils/logger";
import SeatGrid from "../seat-grid";
import Button from "../ui/button";
import Chip from "../ui/chip";
import ConfirmationDialog from "../ui/confirmation-dialog";
import ProgressBar from "../ui/progress-bar";
import Toast from "../ui/toast";

interface RoomProps {
  room: RoomWithDetails;
  onRoomUpdate?: (updatedRoom: RoomWithDetails) => void;
}

export default function Room({ room, onRoomUpdate }: RoomProps) {
  const {
    name,
    seats,
    meeting,
    description,
    floor,
    wheelchair,
    elevator,
    pet_friendly,
    percentOccupied,
    roomStatus,
    occupancyText,
    hasAmenities,
  } = useRoom(room);

  const { deleteRoom, publishRoom } = useRoomMutations();

  const [showPublishConfirmation, setShowPublishConfirmation] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast state
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

  const handleEdit = () => {
    router.push(`/(app)/rooms/edit/${room.id}` as any);
  };

  const handlePublishConfirmation = () => {
    setShowPublishConfirmation(true);
  };

  const handleDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
  };

  const handlePublish = async () => {
    setPublishLoading(true);

    try {
      // Call the actual publish API
      const updatedRoom = await publishRoom(room.id, !room.published);

      if (updatedRoom) {
        // Update local state
        onRoomUpdate?.(updatedRoom as RoomWithDetails);
      }

      setShowPublishConfirmation(false);

      // Show success toast
      const action = room.published ? "unpublished" : "published";
      showToastNotification(
        `Room "${room.name}" ${action} successfully!`,
        "success"
      );

      logger.success(
        `Room "${room.name}" ${
          room.published ? "unpublished" : "published"
        } successfully`
      );
    } catch (error) {
      logger.error("Failed to publish/unpublish room:", error);
      showToastNotification(
        `Failed to ${
          room.published ? "unpublish" : "publish"
        } room. Please try again.`,
        "error"
      );
    } finally {
      setPublishLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);

    try {
      // Call the actual delete API
      await deleteRoom(room.id);

      setShowDeleteConfirmation(false);

      // Show success toast
      showToastNotification(
        `Room "${room.name}" deleted successfully!`,
        "success"
      );

      // The real-time subscription will automatically remove the room from the list
      logger.success(`Room "${room.name}" deleted successfully`);
    } catch (error) {
      logger.error("Failed to delete room:", error);
      showToastNotification(
        "Failed to delete room. Please try again.",
        "error"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelPublish = () => {
    if (!publishLoading) {
      setShowPublishConfirmation(false);
    }
  };

  const cancelDelete = () => {
    if (!deleteLoading) {
      setShowDeleteConfirmation(false);
    }
  };

  return (
    <View className="bg-white rounded-lg shadow-sm p-4 gap-3">
      {/* Admin actions */}
      <View className="flex-row justify-end items-center gap-4 mb-2">
        <Button
          title="Delete"
          icon="delete"
          size="sm"
          variant="danger-ghost"
          onPress={handleDeleteConfirmation}
          className="mr-auto"
        />
        <Button
          title="Edit"
          icon="pencil"
          size="sm"
          variant="primary-outline"
          onPress={handleEdit}
        />
        {!room.published && (
          <Button
            title="Publish"
            icon="publish"
            size="sm"
            variant="success"
            onPress={handlePublishConfirmation}
          />
        )}
      </View>

      <View className="flex-row gap-8">
        {/* 3 of 10 seats available */}
        <View className="flex-1">
          <View className="flex-row gap-1 items-center">
            <MaterialCommunityIcons name="seat" />
            <Text className="text-sm text-gray-600">{occupancyText}</Text>
          </View>

          <ProgressBar progress={percentOccupied} className="mb-2" />

          {/* Badges and floor */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Chip
                label={meeting ? "Meeting Room" : "Workspace"}
                variant="primary"
              />
              <Chip label={roomStatus.label} variant={roomStatus.variant} />
            </View>

            <Text className="text-xs text-gray-500">Floor {floor}</Text>
          </View>
        </View>
      </View>

      {/* Room name */}
      <Text className="text-2xl font-bold leading-tight flex-1">{name}</Text>

      {description && (
        <Text className="text-sm text-gray-600" numberOfLines={2}>
          {description}
        </Text>
      )}

      {/* Seats */}
      <View className="bg-gray-100 rounded-lg">
        <SeatGrid seats={seats} meeting={meeting} />
      </View>

      {hasAmenities && (
        <View className="flex-row items-center gap-2 border-gray-100 flex-wrap">
          {wheelchair && (
            <Chip
              label="Accessible"
              variant="outline"
              icon={
                <MaterialCommunityIcons
                  name="wheelchair-accessibility"
                  size={16}
                  color="#6B7280"
                />
              }
              size="sm"
            />
          )}
          {elevator && (
            <Chip
              label="Elevator"
              variant="outline"
              icon={
                <MaterialCommunityIcons
                  name="elevator"
                  size={16}
                  color="#6B7280"
                />
              }
              size="sm"
            />
          )}
          {pet_friendly && (
            <Chip
              label="Pet Friendly"
              variant="outline"
              icon={
                <MaterialCommunityIcons
                  name="dog-side"
                  size={16}
                  color="#6B7280"
                />
              }
              size="sm"
            />
          )}
        </View>
      )}

      {/* Publish Confirmation Dialog */}
      <ConfirmationDialog
        visible={showPublishConfirmation}
        title={room.published ? "Unpublish Room" : "Publish Room"}
        message={
          room.published
            ? `Are you sure you want to unpublish "${room.name}"? It will no longer be available for bookings.`
            : `Are you sure you want to publish "${room.name}"? This will make it available for bookings.`
        }
        confirmText="Publish"
        confirmVariant="success"
        icon="publish"
        onConfirm={handlePublish}
        onCancel={cancelPublish}
        loading={publishLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        visible={showDeleteConfirmation}
        title="Delete Room"
        message={`Are you sure you want to delete "${room.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        icon="delete"
        onConfirm={handleDelete}
        onCancel={cancelDelete}
        loading={deleteLoading}
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
