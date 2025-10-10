import { RoomWithDetails } from "@/src/types/room";
import { router } from "expo-router";
import { useState } from "react";

interface UseRoomActionsProps {
  room: RoomWithDetails;
  onRoomUpdate?: (updatedRoom: RoomWithDetails) => void;
}

export interface ConfirmationState {
  visible: boolean;
  type: "delete" | "publish" | null;
  loading: boolean;
}

export function useRoomActions({ room, onRoomUpdate }: UseRoomActionsProps) {
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>(
    {
      visible: false,
      type: null,
      loading: false,
    }
  );

  const handleEdit = () => {
    // Navigate to edit page with room ID
    router.push(`/rooms/edit/${room.id}` as any);
  };

  const showDeleteConfirmation = () => {
    setConfirmationState({
      visible: true,
      type: "delete",
      loading: false,
    });
  };

  const showPublishConfirmation = () => {
    setConfirmationState({
      visible: true,
      type: "publish",
      loading: false,
    });
  };

  const hideConfirmation = () => {
    if (!confirmationState.loading) {
      setConfirmationState({
        visible: false,
        type: null,
        loading: false,
      });
    }
  };

  const handleDelete = async () => {
    setConfirmationState((prev) => ({ ...prev, loading: true }));

    try {
      // TODO: Replace with actual API call
      // await deleteRoom(room.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate back after successful deletion
      hideConfirmation();
      router.back();

      // You might want to show a success toast here
      console.log(`Room "${room.room_name}" deleted successfully`);
    } catch (error) {
      console.error("Failed to delete room:", error);
      setConfirmationState((prev) => ({ ...prev, loading: false }));
      // You might want to show an error toast here
    }
  };

  const handlePublish = async () => {
    setConfirmationState((prev) => ({ ...prev, loading: true }));

    try {
      // TODO: Replace with actual API call
      // await publishRoom(room.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Optimistic update - update room status
      const updatedRoom: RoomWithDetails = {
        ...room,
        published: true,
      };

      onRoomUpdate?.(updatedRoom);
      hideConfirmation();

      // You might want to show a success toast here
      console.log(`Room "${room.room_name}" published successfully`);
    } catch (error) {
      console.error("Failed to publish room:", error);
      setConfirmationState((prev) => ({ ...prev, loading: false }));
      // You might want to show an error toast here
    }
  };

  const handleConfirm = () => {
    if (confirmationState.type === "delete") {
      handleDelete();
    } else if (confirmationState.type === "publish") {
      handlePublish();
    }
  };

  const getConfirmationProps = () => {
    const baseProps = {
      visible: confirmationState.visible,
      onConfirm: handleConfirm,
      onCancel: hideConfirmation,
      loading: confirmationState.loading,
    };

    switch (confirmationState.type) {
      case "delete":
        return {
          ...baseProps,
          title: "Delete Room",
          message: `Are you sure you want to delete "${room.room_name}"? This action cannot be undone.`,
          confirmText: "Delete",
          confirmVariant: "danger" as const,
          icon: "delete" as const,
        };
      case "publish":
        return {
          ...baseProps,
          title: "Publish Room",
          message: `Are you sure you want to publish "${room.room_name}"? This will make it available for bookings.`,
          confirmText: "Publish",
          confirmVariant: "primary" as const,
          icon: "publish" as const,
        };
      default:
        return {
          ...baseProps,
          title: "",
          message: "",
        };
    }
  };

  return {
    confirmationState,
    confirmationProps: getConfirmationProps(),
    actions: {
      handleEdit,
      showDeleteConfirmation,
      showPublishConfirmation,
      hideConfirmation,
    },
  };
}
